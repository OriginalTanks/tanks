package game.board.elements;

import game.util.Coordinate;
import game.util.TANK_DIR;
import game.util.TANK_MOVES;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Embedded;
import org.mongodb.morphia.annotations.Transient;

import java.awt.Image;
import java.util.Comparator;
import java.util.List;

/**
 * Created by gladi on 11/12/2015.
 */
@Embedded
public abstract class Tank implements BoardElement , Comparable<Tank> {
    private Coordinate coord;
    private ObjectId tankID;
    private String tankName;
    private int health;
    private TANK_DIR dir;
    @Transient
    private int alias;
    private int actionPoints = 0;
    //if tank has shot without reloading
    private boolean shot;
    
    //in case they decide to implement the superclass for some reason
    // it's just the same stats as the BasicTank
    //each tank class has their own ap costs
    // I'm thinking it can then be called in the game class in that big switch?
	private int moveCost = 2;
	private int shootCost = 2;
	private int turnCost = 1;
	private int diagCost = 4;
	private int reloadCost = 4;
	private int damage = 7;
	
	//These are the values needed for the armory
	private int gamesWon = 0;
	private int gamesLost = 0;
	private int draws = 0;
	private int tanksKilled = 0;
	private int gamesPlayed = 0;
	//How are we storing tank images? I'm not really sure
	private Image tankImage;
	private String error_message;
	
	//Kind of shoehorning it, but to prevent them editing things they shouldn't
	private String password = "poekillsKylo33#d@rn";

    public Tank() {
    }

    public Tank(ObjectId tankID, String tankName, String tankType) {
        this.tankID = tankID;
        this.tankName = tankName;
        if(tankType.equals("Heavy"))
        	health = 50;
        else if(tankType.equals("Basic"))
        	health = 35;
        else if(tankType.equals("Light"))
        	health = 20;
        else
        	health = 35;
        shot = false;
    }

    public abstract TANK_MOVES calculateTurn(List<Tank> tanks, int size);

    @Override
    public final Coordinate getCoord() {
        return this.coord;
    }

    @Override
    public final void setCoord(Coordinate coord) {
    	this.coord = coord;
    }

    public final ObjectId getTankID() {
        return tankID;
    }


    public final String getTankName() {
        return tankName;
    }

    public final int getHealth() {
        return health;
    }

    public final void takeDamage(int damage) {
        this.health -= damage;
    }

    public final TANK_DIR getDir() {
        return dir;
    }

    public final void setDir(TANK_DIR dir) {
    	this.dir = dir;
    }

    public int getAlias() {
        return alias;
    }

    public void setAlias(int alias) {
        this.alias = alias;
    }
    
    public int getActionPoints() {
    	return actionPoints;
    }

    /*
     * These are the AP cost get statements
     */
    
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

	public void setShot(boolean shot){
		this.shot = shot;
	}

	public void addActionPoints(int add){
		actionPoints+=add;
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
	/*
	 * here's wins/losses/kill counts
	 */
	
	public int getGamesWon() {
		return gamesWon;
	}

	public void incGamesWon(String passphrase) {
		if(passphrase.equals(password)){
			gamesWon++;
			gamesPlayed++;
		}
	}

	public int getGamesLost() {
		return gamesLost;
	}

	public void incGamesLost(String passphrase) {
		if(passphrase.equals(password)){
			gamesLost++;
			gamesPlayed++;
		}
	}

	public int getTanksKilled() {
		return tanksKilled;
	}

	public void incTanksKilled(String passphrase) {
		if(passphrase.equals(password))
			tanksKilled++;
	}

	public int getDraws() {
		return draws;
	}

	public void incDraws(String passphrase) {
		if(passphrase.equals(password)){
			draws++;
			gamesPlayed++;
		}
	}

	public int getGamesPlayed() {
		return gamesPlayed;
	}

	@Override
	public int compareTo(Tank o) {
		return this.actionPoints - o.actionPoints;
	}

	public String getError_message(){
		return error_message;
	}

	public void setError_message(String message){
		this.error_message = message;
	}
}

