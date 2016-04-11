package game.board.elements;

import game.util.TANK_MOVES;

import java.util.List;

import org.bson.types.ObjectId;

/**
 * 
 * @author Sean
 * A good all-around tank. Tougher than a light tank and faster
 * than a heavy tank.
 */
 
/*
 * Movement costs for basic tank
 * Move: 2
 * Shoot: 2
 * Turn: 1
 * Diagonal: 4
 * Reload: 4
 * 
 * damage: 7
 */
public abstract class BasicTank extends Tank{
//	private int health = 35;
	private int moveCost = 2;
	private int shootCost = 2;
	private int turnCost = 1;
	private int diagCost = 4;
	private int reloadCost = 4;
	private int damage = 7;
	
	public BasicTank(){
		
	}
	
	public BasicTank(ObjectId tankID, String tankName){
		super(tankID, tankName, "Basic");
	}
	
    public abstract TANK_MOVES calculateTurn(List<Tank> tanks, int size);

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
