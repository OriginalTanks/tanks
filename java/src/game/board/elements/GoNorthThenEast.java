package game.board.elements;

import game.util.TANK_DIR;
import game.util.TANK_MOVES;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Embedded;
import game.board.elements.*;

import java.util.List;

/**
 * Created by ndavis on 11/13/15.
 */
@Embedded
public class GoNorthThenEast extends BasicTank {

    public GoNorthThenEast() {
    }

    public GoNorthThenEast(ObjectId tankID, String tankName) {
        super(tankID, tankName);
    }

    @Override
    public TANK_MOVES calculateTurn(List<Tank> tanks, int size) {
        if (this.getCoord().getY() != 1) {
            if (this.getDir() != TANK_DIR.N) {
                return TANK_MOVES.TURN_RIGHT;
            } else {
                return TANK_MOVES.MOVE_FORWARD;
            }
        } else {
            if (this.getDir() != TANK_DIR.E) {
                return TANK_MOVES.TURN_RIGHT;
            } else {
                return TANK_MOVES.SHOOT;
            }
        }
    }
}
