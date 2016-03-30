package poller;

import com.mongodb.MongoClient;
import database.*;
import game.board.elements.Tank;
import org.mongodb.morphia.Morphia;
import pregameprocessor.TankCodeLoader;

import java.util.List;

/**
 * Created by seidl on 2/3/16.
 */
public class TankPoller implements Runnable{

    public static int num = 0;

    private int milliseconds;
    private UserDAO userDAO;
    private int sleepTime;
    Morphia morphia;
    MongoClient mongoClient;

    public TankPoller(int sleepTime){
        this.sleepTime = sleepTime;
        String hostName = "localhost";
        int port = 27017;
        String dbName = "tanks";

        mongoClient = new MongoClient(hostName, port);
        morphia = new Morphia();
        morphia.mapPackage("database");
        userDAO = new UserDAO(mongoClient,morphia,dbName);
    }
    @Override
    public void run() {
        while(true){
            try {
                poll();
                //Default set to 3 sleep.
                Thread.sleep(sleepTime);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void poll(){
        System.out.println("Polling for Tanks");
        List<DBUser> users = userDAO.createQuery().asList();
        for(DBUser user: users){
            for(DBTank tank: user.getTanks()){
                if(tank.getStatus() == DBTank.COMPILE_STATUS.UNCOMPILED || tank.getStatus() == null){
                    if(TankCodeLoader.loadTank(tank.getId(),"c" + TankPoller.num,null).getTankName() != null) {
                        tank.setStatus(DBTank.COMPILE_STATUS.SUCCESS);
                        System.out.println("Successful");
                    }else{
                        tank.setStatus(DBTank.COMPILE_STATUS.FAIL);
                        System.out.println("Failed");
                    }
                }
            }
            userDAO.save(user);
        }
    }
}
