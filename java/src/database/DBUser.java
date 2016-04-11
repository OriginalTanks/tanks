package database;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.*;

import java.util.List;

/**
 * Created by nathand on 11/28/15.
 */
@Entity("users")
public class DBUser {

    @Id
    private ObjectId id;

    @Indexed(unique=true)
    private String username;
    private String password_hash;
    private List<DBTank> tanks;
    private int kills;
    private int deaths;
    private int wins;

    public DBUser() {}

    public ObjectId getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }

    public List<DBTank> getTanks() {
        return tanks;
    }

    public void setTanks(List<DBTank> tanks) {
        this.tanks = tanks;
    }

}
