package database;

import com.google.gson.Gson;
import game.Game;
import game.board.Board;
import game.board.SquareBoardImpl;
import game.board.elements.Tank;
import game.board.elements.TankImpl;
import game.user.User;
import org.bson.types.ObjectId;
import org.mongodb.morphia.query.Query;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ndavis on 11/13/15.
 */
public class DatabaseTest {

    private GameDatabaseImpl db = new GameDatabaseImpl();

    public static void run() {

        DatabaseTest db_test = new DatabaseTest();
        db_test.runInternal();
    }

    private void runInternal() {

        System.out.println("=============== DatabaseTest ================");
        System.out.println("Running this method");


        sandbox();
        //testGames();
    }

    public void testGames() {


        //l.addMessage(new Message("test user", "this is a message"));
        List<User> u = new ArrayList<>();
        u.add(new User(new ObjectId("1"), "bob", new ObjectId("1"), "destroyer"));
        List<Tank> t = new ArrayList<>();
        t.add(new TankImpl(new ObjectId("1"), "destroyer"));
        Board board = new SquareBoardImpl(30);
        Game game = new Game(u, t, board);
        game.startGame();

        //Game ga = manager.getGame(game);
        db.saveGame(game);
        System.out.println("Saved the game");

        ObjectId id = null;
        List<Game> games = db.listGames();
        for (Game g: games){
            id = g.getId();
            System.out.println(new Gson().toJson(g));
        }

        Game g = db.loadGame(id);
        System.out.println(new Gson().toJson(g));

        System.out.println("Done");
    }

    public void sandbox() {

        GameDatabaseImpl db = (GameDatabaseImpl) GameDatabaseImpl.getSingleton();
        GamesDAO gameDAO = db.getGameDAO();
        UserDAO userDAO = db.getUserDAO();

        System.out.println("Something here");

        Query<DBUser> q = userDAO.createQuery().field("tanks.name").equal("Jimmy The Destroyer");
        List<DBUser> users = q.asList();
        System.out.format("User count: %d%n", users.size());
        for (DBUser u: users) {
            System.out.println(u);
        }

    }

}
