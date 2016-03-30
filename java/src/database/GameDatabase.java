package database;

import game.Game;
import org.bson.types.ObjectId;

import java.util.List;

/**
 * Created by ndavis on 11/13/15.
 */
public interface GameDatabase {

    public boolean saveGame(Game game);
    public Game loadGame(ObjectId gameId);
    public List<Game> listGames();

    public List<Game> listReadyGames();

    public boolean saveDBUser(DBUser dbUser);
    public DBUser loadDBUser(ObjectId dbUserId);
    public List<DBUser> listDBUsers();

    public DBUser findDBUserByTankId(ObjectId tankId);
    public DBTank loadDBTank(ObjectId tankId);

}
