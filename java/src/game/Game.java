package game;

import game.board.Board;
import game.board.SquareBoardImpl;
import game.board.elements.BoardElement;
import game.board.elements.CoreTank;
import game.board.elements.Tank;
import game.board.elements.Wall;
import game.user.User;
import game.util.Coordinate;
import game.util.MoveTracker;
import game.util.TANK_MOVES;
import game.util.LogItem;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Embedded;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Transient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

/**
 * Created by gladi on 11/12/2015.
 */
@Entity("games")
public class Game {
    @Id
    private ObjectId id;
    @Embedded
    private List<User> users;
    @Embedded
    private String name;
    @Embedded
    private List<Tank> tanks;
    private List<ObjectId> tankIds;
    @Transient
    private Board board;
    private ObjectId winnerID;
    @Transient
    private int boardSize = 30;
    @Embedded
    private MoveTracker moves;
    @Transient
    private int currentTurn = 0;
    @Transient
    private int maxTurns = 1000;
    public boolean ready;
    private int status;

    /**
     * Priority queue of tanks
     */
    @Transient
    private PriorityQueue<Tank> tankQueue;
    
    //this is the passphrase used to prevent the user from updating their own wins, coordinates, or dir
    private String statsPassword = "poekillsKylo33#d@rn";

    @Embedded
    private List<LogItem> errors;

    public Game() {
        this.moves = new MoveTracker();
        this.users = new ArrayList<User>();
        this.tanks = new ArrayList<Tank>();
        this.board = new SquareBoardImpl(boardSize);
        tankQueue = new PriorityQueue<>();
    }

    public Game(List<User> user, List<Tank> tanks, Board board) {
        this.moves = new MoveTracker();
        this.users = user;

        this.tanks = tanks;
        this.board = board;
        tankQueue = new PriorityQueue<>();
    }

    public void startGame() {
        for (int i = 0; i < tanks.size(); i++) {
            board.addTank(tanks.get(i), i);
            tanks.get(i).setAlias(i);
            tankQueue.add(tanks.get(i));
        }
        TANK_MOVES move;

        //go until there is only 1 tank left
        while (tankQueue.size() > 1) {


            //pull out the highest priority tank
            Tank t = tankQueue.poll();

                try {
                    move = t.calculateTurn(Collections.unmodifiableList(tanks), boardSize);
                    switch (move) {
                        case SHOOT:

                            //if tank has shot, fall to reload
                            if(!t.getShot()){
                                t.addActionPoints(t.getShootCost());
                                shoot(t);
                                t.setShot(true);
                                break;
                            }
                            move = TANK_MOVES.RELOAD;

                        case RELOAD:
                            t.addActionPoints(t.getReloadCost());
                            t.setShot(false);
                            break;
                        case TURN_RIGHT:
                            t.addActionPoints(t.getTurnCost());
                            t.setDir(t.getDir().rotateRight(t.getDir()));
                            break;
                        case TURN_LEFT:
                            t.addActionPoints(t.getTurnCost());
                            t.setDir(t.getDir().rotateLeft(t.getDir()));
                            break;
                        case WAIT:
                            t.addActionPoints(1);
                            break;
                        case MOVE_FORWARD:
                            t.addActionPoints(t.getMoveCost());
                            move = move(t, true, move);
                            break;
                        case MOVE_BACKWARD:
                            t.addActionPoints(t.getMoveCost());
                            move = move(t, false, move);
                            break;
                        case DIE:
                            t.takeDamage(t.getHealth());
                            this.removeTank(t);
                            break;
                    }
                    moves.addMove(t.getAlias(), move);
                    moves.addErr("");
                } catch (Exception e) {
                    // Send the output of e to the user for debugging
                    String tName = t.getTankName();
                    String eCls = e.getClass().toString().substring(6);
                    String eMsg = e.getMessage();
                    String eStk = e.getStackTrace()[0].toString();
                    String eErr = eCls + (eMsg == null ? "" : (": " + eMsg)) + "\n\tat " + eStk;
                    String rErr = "Runtime error!\nTank: " + tName + ", Turn: " + currentTurn + "\n" + eErr;
                    moves.addErr(rErr);
                    System.err.println(rErr);

                    moves.addMove(t.getAlias(), TANK_MOVES.WAIT);
                }
            //}
            moves.newTurn();
            currentTurn += 1;

            if (t.getHealth() > 0) {
                tankQueue.add(t);
            }

            if (currentTurn > maxTurns) {
            	for (Tank tt: tanks){
            		tt.incDraws(statsPassword);
            	}
                return;
            }
        }
        Tank t = tankQueue.peek();
        ObjectId id = new ObjectId();
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getTankID() == t.getTankID()) {
                id = users.get(i).getUserID();
                users.get(i).incGamesWon();
                t.incGamesWon(statsPassword);
            }
            
            else
            	users.get(i).incGamesLost();
        }
        winnerID = id;

    }

    private TANK_MOVES move(Tank t, boolean forward, TANK_MOVES move) {
        int x = t.getCoord().getX();
        int y = t.getCoord().getY();
        //spots to check for obstructions
        //(the 3 spots that the tank's edge is trying to move into)
        Coordinate[] checkSpots = new Coordinate[] {null, null, null};
        switch (t.getDir()) {
            case N:
                if (forward){
                    y -= 1;
                    //the 3 checkSpots
                    checkSpots[0] = new Coordinate(x-1, y-1);
                    checkSpots[1] = new Coordinate(x, y-1);
                    checkSpots[2] = new Coordinate(x+1, y-1);
                }
                else{
                    y += 1;
                    checkSpots[0] = new Coordinate(x-1, y+1);
                    checkSpots[1] = new Coordinate(x, y+1);
                    checkSpots[2] = new Coordinate(x+1, y+1);
                }
                break;
            case E:
                if (forward){
                    x += 1;
                    checkSpots[0] = new Coordinate(x+1, y-1);
                    checkSpots[1] = new Coordinate(x+1, y);
                    checkSpots[2] = new Coordinate(x+1, y+1);
                }
                else{
                    x -= 1;
                    checkSpots[0] = new Coordinate(x-1, y-1);
                    checkSpots[1] = new Coordinate(x-1, y);
                    checkSpots[2] = new Coordinate(x-1, y+1);
                }
                break;
            case S:
                if (forward){
                    y += 1;
                    checkSpots[0] = new Coordinate(x-1, y+1);
                    checkSpots[1] = new Coordinate(x, y+1);
                    checkSpots[2] = new Coordinate(x+1, y+1);
                }
                else{
                    y -= 1;
                    checkSpots[0] = new Coordinate(x-1, y-1);
                    checkSpots[1] = new Coordinate(x, y-1);
                    checkSpots[2] = new Coordinate(x+1, y-1);
                }
                break;
            case W:
                if (forward){
                    x -= 1;
                    checkSpots[0] = new Coordinate(x-1, y-1);
                    checkSpots[1] = new Coordinate(x-1, y);
                    checkSpots[2] = new Coordinate(x-1, y+1);
                }
                else{
                    x += 1;
                    checkSpots[0] = new Coordinate(x+1, y-1);
                    checkSpots[1] = new Coordinate(x+1, y);
                    checkSpots[2] = new Coordinate(x+1, y+1);
                }
                break;
        }
        
        //if tank center < 1 or > boardSize - 2, tank edge is out of bounds
        if (y < 1 || y > boardSize - 2 || x < 1 || x > boardSize - 2) {

            return TANK_MOVES.WAIT;
        } else {
            //for each checkSpot
            for(int i = 0; i < 3; ++i){
	            //if not empty
	            if (board.getElementAt(checkSpots[i]) != null) {
            		return TANK_MOVES.WAIT;
	            }
            }

            board.setElementAt(t.getCoord().getX(), t.getCoord().getY(), null);
            t.setCoord(new Coordinate(x, y));
            board.setElementAt(x, y, t);
            return move;

        }
    }

    // Remove the dead tank from the queue, list, and board
    private void removeTank(Tank t) {
        tankQueue.remove(t);
        tanks.remove(t);
        board.setElementAt(t.getCoord().getX(), t.getCoord().getY(), null);
    }

    // Handles the event of a bullet at coordinates (xCoord, yCoord) fired from firingTank
    // Returns true if the bullet hit something, false if it didn't
    private boolean handleBulletAtCoordinates(int xCoord, int yCoord, Tank firingTank) {
        BoardElement elem = board.getElementAt(xCoord, yCoord);

        // Check if the bullet hit another tank
        boolean b1 = elem != null;
        boolean b2 = (elem instanceof Tank);
        boolean b3 = (Tank) elem != firingTank;
        if (elem != null && (elem instanceof Tank) && (Tank) elem != firingTank) {

            ((Tank) elem).takeDamage(firingTank.getDamage());

            // Check if it killed the tank
            if (((Tank) elem).getHealth() <= 0) {

                this.removeTank((Tank) elem);

                // Add a move for the dying tank
                this.moves.addMove(((Tank) elem).getAlias(), TANK_MOVES.DIE);
                this.moves.addErr("");
                this.moves.newTurn();
                currentTurn += 1;

                // Give credit for the kill
                for (User user : users) {
                    if (user.getTankID() == firingTank.getTankID()) {
                        user.incTanksKilled();
                        firingTank.incTanksKilled(statsPassword);
                    }
                }

                // Give credit for the lost game to the dead tank
                ((Tank) elem).incGamesLost(statsPassword);
            }
            return true;

        // Check if the bullet is in the original square of the tank that fired it
        // Don't count this as a collision
        } else if (elem != null && (elem instanceof Tank) && (Tank) elem == firingTank) {
            return false;

        // Check if the bullet hit a wall or other kind of object
        } else {
            return elem != null;
        }
    }

    private void shoot(Tank t) {
        switch (t.getDir()) {
            case N:
                for (int y = t.getCoord().getY(); y >= 0; y--) {
                    if (this.handleBulletAtCoordinates(t.getCoord().getX(), y, t)) {
                        break;
                    }
                }
                break;
            case E:
                for (int x = t.getCoord().getX(); x < board.getSize(); x++) {
                    if (this.handleBulletAtCoordinates(x, t.getCoord().getY(), t)) {
                        break;
                    }
                }
                break;
            case S:
                for (int y = t.getCoord().getY(); y < board.getSize(); y++) {
                    if (this.handleBulletAtCoordinates(t.getCoord().getX(), y, t)) {
                        break;
                    }
                }
                break;
            case W:
                for (int x = t.getCoord().getX(); x >= 0; x--) {
                    if (this.handleBulletAtCoordinates(x, t.getCoord().getY(), t)) {
                        break;
                    }
                }
                break;
        }
    }

    public ObjectId getId() {
        return id;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public List<Tank> getTanks() {
        return tanks;
    }

    public void setTanks(List<Tank> tanks) {
        this.tanks = tanks;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }

    public ObjectId getWinnerID() {
        return winnerID;
    }

    private void setWinnerID(ObjectId winnerID) {
        this.winnerID = winnerID;
    }

    public List<ObjectId> getTankIds() {
        return tankIds;
    }

    public void createMoveTracker() {
        this.moves = new MoveTracker();
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

}


