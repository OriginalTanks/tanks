package database;

import com.mongodb.MongoClient;
import game.Game;
import org.bson.types.ObjectId;
import org.mongodb.morphia.Morphia;

import java.util.List;

/**
 * Created by ndavis on 11/13/15.
 */
public class GameDatabaseImpl implements GameDatabase {

    private GamesDAO gameDAO;
    private UserDAO userDAO;

    static GameDatabase gd = null;
    public static GameDatabase getSingleton() {
        if (gd != null) {
            return gd;
        } else {
            gd = new GameDatabaseImpl();
            return gd;
        }
    }

    public GameDatabaseImpl() {

        String hostName = "localhost";
        int port = 27017;
        String dbName = "tanks";

        MongoClient mongoClient = new MongoClient(hostName, port);
        Morphia morphia = new Morphia();
        morphia.mapPackage("game");
        morphia.mapPackage("database");

        gameDAO = new GamesDAO(mongoClient, morphia, dbName);
        userDAO = new UserDAO(mongoClient, morphia, dbName);
    }

    @Override
    public boolean saveGame(Game game) {
        try {
            gameDAO.save(game);
        } catch (Exception ex) {
            System.out.println("Error saving game:");
            ex.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public Game loadGame(ObjectId gameId) {
        return gameDAO.get(gameId);
    }

    @Override
    public List<Game> listGames() {
        return gameDAO.createQuery().asList();
    }

    @Override
    public List<Game> listReadyGames() {
        return gameDAO.createQuery().field("ready").equal(true).asList();
    }

    @Override
    public boolean saveDBUser(DBUser dbUser) {
        try {
            userDAO.save(dbUser);
        } catch (Exception ex) {
            System.out.println("Error saving user:");
            ex.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public DBUser loadDBUser(ObjectId dbUserId) {
        return userDAO.get(dbUserId);
    }

    @Override
    public List<DBUser> listDBUsers() {
        return userDAO.createQuery().asList();
    }

    @Override
    public DBUser findDBUserByTankId(ObjectId tankId) {
        return userDAO.createQuery().field("tanks._id").equal(tankId).get();
    }

    @Override
    public DBTank loadDBTank(ObjectId tankId) {
        DBUser user = findDBUserByTankId(tankId);
        for (DBTank dbTank: user.getTanks()) {
            if (dbTank.getId().equals(tankId)) {
                return dbTank;
            }
        }
        return null;
    }

    public GamesDAO getGameDAO() {
        return gameDAO;
    }

    public UserDAO getUserDAO() {
        return userDAO;
    }
}
