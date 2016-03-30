package poller;

import database.GameDatabase;
import database.GameDatabaseImpl;
import game.Game;
import pregameprocessor.GameProcessor;

import java.util.List;

/**
 * Created by Michael Sharp on 12/7/2015.
 */
public class Poller implements Runnable {
    GameDatabase db;
    List<Game> games;
    private int sleepTime;
    public static Integer num = 0;

    public Poller(int sleepTime) throws InterruptedException {
        this.sleepTime = sleepTime;
        this.db = GameDatabaseImpl.getSingleton();
//        while (true) {
//            poll();
//            Thread.sleep(sleepTime);
//        }
    }

    public void poll() {
        System.out.println("Polling for games...");
        games = db.listReadyGames();
        for (Game g : games) {
            try {
                System.out.println("Processing game " + g.getId().toString());
                g = GameProcessor.processGame(g);
                g.startGame();
                g.ready = false;
                g.setStatus(1);
            } catch (Exception e) {
                System.err.format("Poller error\n");
                e.printStackTrace();
                g.ready = false;
                g.setStatus(-1);
            }
            db.saveGame(g);
        }
    }

    @Override
    public void run() {
        while (true) {
            try {
                poll();
                Thread.sleep(sleepTime);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
