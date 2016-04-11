package game.board.elements;

import game.util.TANK_DIR;
import game.util.TANK_MOVES;
import org.bson.types.ObjectId;

import java.util.List;

/**
 * Created by Michael on 11/12/2015.
 */
public class TenkImplement extends LightTank {

    public TenkImplement(ObjectId tankID, String tankName) {
        super(tankID, tankName);
    }


    @Override
    public TANK_MOVES calculateTurn(final List<Tank> tanks, int size) {
        if (this.getDir() != TANK_DIR.E) {
            return TANK_MOVES.TURN_RIGHT;
        }
        return TANK_MOVES.SHOOT;
    }
}
