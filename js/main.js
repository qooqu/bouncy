// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

	preload: function() {

		// Change the background color of the game
		game.stage.backgroundColor = '#71c5cf';

		// Load the player sprite
		// game.load.image('player', 'assets/moon-face.png');
		game.load.image('player', 'https://ik.imagekit.io/p05uzwuasop/moon-face_7grUoI9bk.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642389083226');

		// Load the block sprite
		// game.load.image('block', 'assets/block.png');
		game.load.image('block', 'https://ik.imagekit.io/p05uzwuasop/block_M8bZ1pGcz.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642389083046');

		// Load the coin sprite
		// game.load.image('coin', 'assets/coin.png');
		game.load.image('coin', 'https://ik.imagekit.io/p05uzwuasop/coin_X2YAI3BEbLj.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642389083070');

	},

	create: function() {

		// Set the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Display the player on the screen
		this.player = this.game.add.sprite(100, 25, 'player');

		// Add gravity to the player to make it fall
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 1000;

		// Make some blocks
		this.blocks = game.add.group(); // Create a group
		this.blocks.enableBody = true; // Add physics to the group
		this.blocks.createMultiple(40, 'block'); // Creates some blocks
		this.addOneBlock( 275, 390 );

		// Make some coins
		this.coins = game.add.group(); // Create a group
		this.coins.enableBody = true; // Add physics to the group
		this.coins.createMultiple(40, 'coin'); // Creates some blocks

		// Add blocks and coins
		this.timer = game.time.events.loop(250, this.addRowOfBlocks, this);
		this.timer = game.time.events.loop(250, this.addCoins, this);

		// Initialize and display the score
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "score: 0", { font: "30px Arial", fill: "#ffffff" });

		// Initialize and display the bank
		this.bank = 10;
		this.labelBank = game.add.text(275, 20, "bank: 10", { font: "30px Arial", fill: "#ffffff" });

        // initialize highScore
        this.highScore = document.getElementById('highScore').innerHTML;

	},

	update: function() {

		// Call the 'jump' function when the player hits the blocks
		game.physics.arcade.collide(this.player, this.blocks);
		if (this.player.body.touching.down == true)
			this.jump();

		// Add a block on click
		game.input.onDown.add(this.clickBlock, this);

		// Collect coins
		game.physics.arcade.overlap(this.player, this.coins, this.getCoins, null, this);

		// If the player leaves the world, the player dies
		if (this.player.inWorld == false)
			this.restartGame();

	},

	jump: function() {

		this.player.body.velocity.y = -625;

	},

	addOneBlock: function(x, y) {

		// Get the first dead block of our group
		var block = this.blocks.getFirstDead();

		// Set the new position of the block
		block.reset(x, y);

		// Add velocity to the block to make it move left
		block.body.velocity.x = -200;

		// This keeps it from falling when the player lands on it.
		block.body.immovable = true;

		// Kill the block when it's no longer visible
		block.checkWorldBounds = true;
		block.outOfBoundsKill = true;

	},

	addRowOfBlocks: function() {

		var rollDice = Math.random();
		if (rollDice < 0.25)
			this.addOneBlock( 400, 390 );

		this.score += 1;
		this.labelScore.text = "score: " + this.score;

	},

	clickBlock: function() {

		if ( this.bank > 0 ) {
			this.addOneBlock( game.input.x, game.input.y );
			this.bank -= 1;
			this.labelBank.text = "bank: " + this.bank;
		}

	},

	addOneCoin: function(x, y) {

		var coin = this.coins.getFirstDead();

		coin.reset(x, y);

		coin.body.velocity.x = -200;

		coin.body.immovable = true;

		coin.checkWorldBounds = true;
		coin.outOfBoundsKill = true;

	},

	addCoins: function() {

		var rollDice = Math.random();
		if (rollDice < 0.05)
			this.addOneCoin( 400, 125 );

	},

	getCoins: function(player, coin) {
		coin.kill();
		this.bank += 1;
		this.labelBank.text = "bank: " + this.bank;
	},

	// Restart the game
	restartGame: function() {

		// Start the 'main' state, which restarts the game
		game.state.start('main');

        if (this.score > this.highScore) {
            this.highScore = this.score;
            document.getElementById('highScore').innerHTML = this.highScore;
        }
	},

};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');
