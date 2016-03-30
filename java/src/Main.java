import poller.Poller;
import poller.TankPoller;

/**
 * Created by gladi on 11/12/2015.
 */
public class Main {
    public static void main(String[] args) {
        try {
            Thread gameThread = new Thread(new Poller(5000));
            Thread tankThread = new Thread(new TankPoller(3000));
            gameThread.start();
            tankThread.start();
        } catch (Exception e) {
            System.out.printf("Thread shut down with exception: %s%n", e);
        }


    }
}
