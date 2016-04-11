package pregameprocessor;

import game.Game;
import game.board.SquareBoardImpl;

/**
 * Created by Michael Sharp on 12/7/2015.
 */
public class GameProcessor {

    public static Game processGame(Game game) {

        game = UserLookup.processGame(game);
        game = TankProcessor.processGame(game);
        game.setBoard(new SquareBoardImpl(30));
        game.createMoveTracker();
        // save the game
        //db.saveGame(game);
        return game;
    }
}
