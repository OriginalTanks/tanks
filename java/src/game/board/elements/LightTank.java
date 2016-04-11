package game.board.elements;

import game.util.TANK_MOVES;

import java.util.List;

import org.bson.types.ObjectId;

/**
 * 
 * @author Sean
 * Built for speed, it can get in and out. 
 * Low damage, dies fast.
 */

/*
 * Movement costs for light tank
 * Move: 1
 * Shoot: 2
 * Turn: 1
 * Diagonal: 3
 * Reload: 2
 * 
 * damage: 4
 */
public abstract class LightTank extends Tank{
//	private int health = 20;
	private int moveCost = 1;
	private int shootCost = 2;
	private int turnCost = 1;
	private int diagCost = 3;
	private int reloadCost = 2;
	private int damage = 4;
	
	public LightTank(){
		
	}
	
	public LightTank(ObjectId tankID, String tankName){
		super(tankID, tankName, "Light");
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
