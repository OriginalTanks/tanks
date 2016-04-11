package pregameprocessor;

import game.Game;
import game.board.elements.Tank;
import org.bson.types.ObjectId;
import poller.Poller;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Michael Sharp on 12/7/2015.
 */
public class TankProcessor {
    Integer n;
    public static Game processGame(Game game) {

        List<ObjectId> tankIds = game.getTankIds();

        List<Tank> tanks = new ArrayList<>();
        // Look up each tankID and get the user info
        for (ObjectId tankId : tankIds) {
            tanks.add(TankCodeLoader.loadTank(tankId, "c" + Poller.num.toString(), game));
            Poller.num += 1;
        }

        // Add those users to the game
        game.setTanks(tanks);

        // save the game
        return game;
    }
}
