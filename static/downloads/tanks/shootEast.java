import game.board.elements.LightTank;
import game.board.elements.Tank;
import game.util.Coordinate;
import game.util.TANK_DIR;
import game.util.TANK_MOVES;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Embedded;

import java.util.List;

/**
 * Created by ndavis on 11/13/15.
 */
@Embedded
public class shootEast extends LightTank {

    public shootEast() {
    }

    public shootEast(ObjectId tankID, String tankName) {
        super(tankID, tankName);
    }

    @Override
    public TANK_MOVES calculateTurn(List<Tank> tanks, int size) {
        if (this.getDir() != TANK_DIR.E) {
            return TANK_MOVES.TURN_RIGHT;
        }
        return TANK_MOVES.SHOOT;
    }

    @Override
    public void setCoord(Coordinate coord) {
        return;
    }
}