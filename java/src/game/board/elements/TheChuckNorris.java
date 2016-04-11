package game.board.elements;

import org.bson.types.ObjectId;

public abstract class TheChuckNorris extends Tank{
	private int moveCost = 1;
	private int shootCost = -1;
	private int turnCost = 0;
	private int diagCost = 1;
	private int reloadCost = -1;
	private int damage = 9001;
	
	public TheChuckNorris(){
		
	}
	
	public TheChuckNorris(ObjectId tankID, String tankName){
		super(tankID, tankName, "Heavy");
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
}
