
var Manual = React.createClass({
    render: function() {
		var manualStyle = {
			color: '#E1E1E1'
		};
        return (
            <div className="row" style={manualStyle}>
                <div className="col-md-6">
					<h1>Game Rules</h1>

					<h2>To Win:</h2>
					<p>Destroy all other tanks on the board.</p>

					<h2>How to Play:</h2>
					<ul>
						<li>Create Tank</li>
							<ul>
								<li>You need a tank before you can play! Tanks are implemented in Java. To create a tank, click on ‘Upload a Tank’ on the top navigation bar. You’ll be brought to a page where you can create your tank. Each tank you create needs a name and its implementation. You can either place your code in the textbox or upload the Java file for your new tank. Click ‘Add Tank!’ and your tank is ready to go!</li>
								<li>You can view the tanks that you have created by clicking ‘Your Tanks’ on the top navigation bar. Clicking on the name of your tanks will show the code of that tank.</li>
								<li>You can edit a tank by clicking on that tank in the list of 'Your Tanks' (to be implemented)</li>
							</ul>
						<li>Join Game</li>
							<ul>
								<li>With a tank under your command, you’re ready to join a game. Click on ‘Join a Fight’ and you will see the option to create a new game or join an existing game. Each game is played by 4 players. Once all 4 players have a joined a game, the game begins. You can then watch the fight under ‘See Your Games’ once everything has been compiled and run.</li>
								<li>If you’re the last man standing, you win!</li>
							</ul>
						<li>Action Point System</li>
							<ul>
								<li>This game revolves around an Action Point system. Every action that a tank takes (moving, shooting) consumes a number of Action Points (or not, depending on which system we go with).</li>
								<li>At the beginning of its turn, a tank is given a number of Action Points. Its turn ends if all Action Points have been consumed, or until the player decides to end his or her turn.</li>
								<li>Action Points that are not consumed roll over to the next turn.</li>
								<li>Tanks are allowed to take actions as long as they have enough Action Points.</li>
								<li>After a tank takes its turn, the tank with the highest number of Action Points goes next.</li>
							</ul>
					</ul>

					<h2>Action Points: </h2>
					<p>You get a set number of action points</p>

					<h2>Game Mechanics:</h2>
					<ul>
						<li>The board is a 30x30 grid</li>
						<li>Each tank takes up a 9x9 square, (what about on a diagonal?)</li>
					</ul>

					<h2>Turn Mechanics:</h2>
					<p>The player who goes first can be picked randomly from the four players. Or it could be based on who has the best (or worst) win percentage of all the players in a game. </p>

					<p>Alternative AP System: Each tank has AP variable set to 0 in the beginning of the game. As you take actions, you accrue more action points. The player with the least action points after a turn is the one who goes next. I was talking to Michael and Tommy about this and it seemed like that’s what they were thinking.</p>

					<h2>Move Types and Cost:</h2>
					<pre>
						Move: Go forward 
						Cost: 1 per square moved
						Move: Turn right (90 degrees) 
						Cost: 1
						Move: Turn left (90 degrees) 
						Cost: 1
						Move: Go NE/NW/SE/SW 
						Cost: 4 - Moves you 1 square in the diagonal
						Move: Go backwards 
						Cost: 1 per square moved
						Move: Shoot 
						Cost: 2
						Move: Reload 
						Cost: 4
						Move: Do nothing 
						Cost: 1 
					</pre>

					<h2>Things to Know:</h2>
					<p>There’s 4 tanks</p>
					<p>Each player has access to a list of all objects that are on the board: tanks, obstacles, dropped items, bullets(if we get rid of laser bullets), etc. For now, tanks are able to see everything on the whole board. Eventually we may restrict a player’s vision to a certain space around them as a type of “fog of war” feature.</p>
                </div>
            </div>
            );
    }
});

module.exports = Manual;
