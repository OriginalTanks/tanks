package game.board.elements;

import game.util.TANK_MOVES;

import java.util.List;

import org.bson.types.ObjectId;

/**
 * 
 * @author Sean
 * High costs, but more health and more damage.
 */

/*
 * Movement costs for heavy tank
 * Move: 4
 * Shoot: 5
 * Turn: 2
 * Diagonal: 8
 * Reload: 8
 * 
 * damage: 10
 */
public abstract class HeavyTank extends Tank{
//	private int health = 50;
	private int moveCost = 4;
	private int shootCost = 5;
	private int turnCost = 2;
	private int diagCost = 8;
	private int reloadCost = 8;
	private int damage = 10;
	
	public HeavyTank(){
		
	}
	
	public HeavyTank(ObjectId tankID, String tankName){
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
