package game.board.elements;

import game.util.Coordinate;
import game.util.TANK_DIR;
import game.util.TANK_MOVES;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Embedded;
import org.mongodb.morphia.annotations.Transient;

import java.util.Comparator;
import java.util.List;

/**
 * Comparator is for the new priority queue
 */
@Embedded
public abstract class CoreTank {
    private Coordinate coord;
    private ObjectId tankID;
    private String tankName;
    private int health;
    private TANK_DIR dir;
    @Transient
    private int alias;
    private int actionPoints = 0;
    private boolean shot;
	private int moveCost;
	private int shootCost;
	private int turnCost;
	private int diagCost;
	private int reloadCost;
	private int damage;

    public CoreTank() {
    }

    public CoreTank(ObjectId tankID, String tankName) {
        this.tankID = tankID;
        this.tankName = tankName;
    }

	public void addActionPoints(int add){
		actionPoints+=add;
	}

    public abstract TANK_MOVES calculateTurn(List<Tank> tanks, int size);

    public Coordinate getCoord() {
        return this.coord;
    }

    public ObjectId getTankID() {
        return tankID;
    }

    public String getTankName() {
        return tankName;
    }

    public int getHealth() {
        return health;
    }

    public TANK_DIR getDir() {
        return dir;
    }

    public int getAlias() {
        return alias;
    }

    public int getActionPoints() {
    	return actionPoints;
    }

	public int getMoveCost() {
		return moveCost;
	}

	public int getShootCost() {
		return shootCost;
	}

	public int getTurnCost() {
		return turnCost;
	}

	public int getDiagCost() {
		return diagCost;
	}

	public int getReloadCost() {
		return reloadCost;
	}

	public int getDamage() {
		return damage;
	}

	public boolean getShot(){
		return shot;
	}

	protected boolean tankNorth(List<Tank> tanks){
		for(int i = 0; i < tanks.size(); ++i)
			if(Math.abs(tanks.get(i).getCoord().getX() - this.getCoord().getX()) <= 1 &&
			  tanks.get(i).getCoord().getY() < this.getCoord().getY())
				return true;
		return false;
	}

	protected boolean tankEast(List<Tank> tanks){
		for(int i = 0; i < tanks.size(); ++i)
			if(Math.abs(tanks.get(i).getCoord().getY() - this.getCoord().getY()) <= 1 &&
			  tanks.get(i).getCoord().getX() > this.getCoord().getX())
				return true;
		return false;
	}

	protected boolean tankSouth(List<Tank> tanks){
		for(int i = 0; i < tanks.size(); ++i)
			if(Math.abs(tanks.get(i).getCoord().getX() - this.getCoord().getX()) <= 1 &&
			  tanks.get(i).getCoord().getY() > this.getCoord().getY())
				return true;
		return false;
	}

	protected boolean tankWest(List<Tank> tanks){
		for(int i = 0; i < tanks.size(); ++i)
			if(Math.abs(tanks.get(i).getCoord().getY() - this.getCoord().getY()) <= 1 &&
			  tanks.get(i).getCoord().getX() < this.getCoord().getX())
				return true;
		return false;
	}

	protected boolean tankFront(List<Tank> tanks){
		return(((this.getDir() == TANK_DIR.N) && tankNorth(tanks)) ||
		  ((this.getDir() == TANK_DIR.E) && tankEast(tanks)) ||
		  ((this.getDir() == TANK_DIR.S) && tankSouth(tanks)) ||
		  ((this.getDir() == TANK_DIR.W) && tankWest(tanks)));
	}

	protected boolean tankRight(List<Tank> tanks){
		return(((this.getDir() == TANK_DIR.N) && tankEast(tanks)) ||
		  ((this.getDir() == TANK_DIR.E) && tankSouth(tanks)) ||
		  ((this.getDir() == TANK_DIR.S) && tankWest(tanks)) ||
		  ((this.getDir() == TANK_DIR.W) && tankNorth(tanks)));
	}

	protected boolean tankBehind(List<Tank> tanks){
		return(((this.getDir() == TANK_DIR.N) && tankSouth(tanks)) ||
		  ((this.getDir() == TANK_DIR.E) && tankWest(tanks)) ||
		  ((this.getDir() == TANK_DIR.S) && tankNorth(tanks)) ||
		  ((this.getDir() == TANK_DIR.W) && tankEast(tanks)));
	}

	protected boolean tankLeft(List<Tank> tanks){
		return(((this.getDir() == TANK_DIR.N) && tankWest(tanks)) ||
		  ((this.getDir() == TANK_DIR.E) && tankNorth(tanks)) ||
		  ((this.getDir() == TANK_DIR.S) && tankEast(tanks)) ||
		  ((this.getDir() == TANK_DIR.W) && tankSouth(tanks)));
	}

	protected boolean wallFront(int size){
		return(((this.getCoord().getY() == 1) && (this.getDir() == TANK_DIR.N)) ||
		  ((this.getCoord().getX() == size - 2) && (this.getDir() == TANK_DIR.E)) ||
		  ((this.getCoord().getY() == size - 2) && (this.getDir() == TANK_DIR.S)) ||
		  ((this.getCoord().getX() == 1) && (this.getDir() == TANK_DIR.W)));
	}

	protected boolean wallRight(int size){
		return(((this.getCoord().getY() == 1) && (this.getDir() == TANK_DIR.W)) ||
		  ((this.getCoord().getX() == size - 2) && (this.getDir() == TANK_DIR.N)) ||
		  ((this.getCoord().getY() == size - 2) && (this.getDir() == TANK_DIR.E)) ||
		  ((this.getCoord().getX() == 1) && (this.getDir() == TANK_DIR.S)));
	}

	protected boolean wallBehind(int size){
		return(((this.getCoord().getY() == 1) && (this.getDir() == TANK_DIR.S)) ||
		  ((this.getCoord().getX() == size - 2) && (this.getDir() == TANK_DIR.W)) ||
		  ((this.getCoord().getY() == size - 2) && (this.getDir() == TANK_DIR.N)) ||
		  ((this.getCoord().getX() == 1) && (this.getDir() == TANK_DIR.E)));
	}

	protected boolean wallLeft(int size){
		return(((this.getCoord().getY() == 1) && (this.getDir() == TANK_DIR.E)) ||
		  ((this.getCoord().getX() == size - 2) && (this.getDir() == TANK_DIR.S)) ||
		  ((this.getCoord().getY() == size - 2) && (this.getDir() == TANK_DIR.W)) ||
		  ((this.getCoord().getX() == 1) && (this.getDir() == TANK_DIR.N)));
	}

	protected TANK_DIR rightDir(){
		switch(this.getDir()){
			case N:
				return TANK_DIR.E;
			case E:
				return TANK_DIR.S;
			case S:
				return TANK_DIR.W;
			default:
				return TANK_DIR.N;
		}
	}

	protected TANK_DIR leftDir(){
		switch(this.getDir()){
			case N:
				return TANK_DIR.W;
			case W:
				return TANK_DIR.S;
			case S:
				return TANK_DIR.E;
			default:
				return TANK_DIR.N;
		}
	}

	protected TANK_DIR behindDir(){
		switch(this.getDir()){
			case N:
				return TANK_DIR.S;
			case S:
				return TANK_DIR.N;
			case E:
				return TANK_DIR.W;
			default:
				return TANK_DIR.E;
		}
	}
}
