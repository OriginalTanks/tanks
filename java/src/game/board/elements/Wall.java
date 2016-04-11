package game.board.elements;

import game.util.Coordinate;
import org.mongodb.morphia.annotations.Embedded;

/**
 * Created by gladi on 11/12/2015.
 */
@Embedded
public class Wall implements BoardElement {
    private Coordinate coord;

    public Wall() {

    }

    @Override
    public Coordinate getCoord() {
        return this.coord;
    }

    @Override
    public void setCoord(Coordinate coord) {
        this.coord = coord;
    }
}