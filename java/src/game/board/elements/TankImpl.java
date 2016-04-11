package game.board.elements;

import game.util.TANK_DIR;
import game.util.TANK_MOVES;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Embedded;

import java.util.List;

/**
 * Created by ndavis on 11/13/15.
 */
@Embedded
public class TankImpl extends BasicTank {

    public TankImpl() {
    }

    public TankImpl(ObjectId tankID, String tankName) {
        super(tankID, tankName);
    }

    @Override
    public TANK_MOVES calculateTurn(List<Tank> tanks, int size) {
        if (this.getDir() != TANK_DIR.N) {
            return TANK_MOVES.TURN_RIGHT;
        } else {
            return TANK_MOVES.MOVE_FORWARD;
        }
    }
}
