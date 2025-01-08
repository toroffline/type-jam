import { Scene } from "phaser";

export class MainScene extends Scene {
    car = null;
    lanes = { left: null, center: null, right: null };
    currentLane = "center";
    currentWord = "";
    score = 0;

    // Words for each lane
    LEFT_WORDS = ["sad", "fad", "gas", "dad", "add"];
    CENTER_WORDS = ["kite", "bite", "site", "time", "lime"];
    RIGHT_WORDS = ["pool", "cool", "tool", "fool", "doll"];

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        // this.add.image(0, 0, "background").setOrigin(0, 0);

        this.drawMap();
        // Add lanes
        this.lanes.left = this.add.text(
            200,
            100,
            this.getRandomWord(this.LEFT_WORDS),
            {
                fontSize: "32px",
                fill: "#fff",
            }
        );
        this.lanes.center = this.add
            .text(width / 2, 100, this.getRandomWord(this.CENTER_WORDS), {
                fontSize: "32px",
                fill: "#fff",
            })
            .setOrigin(0.5, 0);
        this.lanes.right = this.add.text(
            width - 200,
            100,
            this.getRandomWord(this.RIGHT_WORDS),
            {
                fontSize: "32px",
                fill: "#fff",
            }
        );

        // Add car (rectangle)
        this.car = this.add.rectangle(
            width / 2,
            height - 100,
            50,
            100,
            0x61dafb
        );

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", {});
            // Input event listener
            this.input.keyboard.on("keydown", (event) => {
                if (event.key === "Enter") {
                    this.checkWord();
                } else if (event.key.length === 1) {
                    this.currentWord += event.key;
                } else if (event.key === "Backspace") {
                    this.currentWord = this.currentWord.slice(0, -1);
                }
            });

            // Display the current word being typed
            this.currentWordText = this.add
                .text(width / 2, height - 200, "", {
                    fontSize: "32px",
                    fill: "#fff",
                })
                .setOrigin(0.5);
        });
    }

    update() {
        this.currentWordText.setText(this.currentWord);
    }

    getRandomWord(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    checkWord() {
        const { width } = this.cameras.main;
        if (this.currentWord === this.lanes.left.text) {
            // Move car to the left lane
            this.car.x = 200;
            this.updateLane("left");
        } else if (this.currentWord === this.lanes.center.text) {
            // Keep car in the center lane
            this.car.x = width / 2;
            this.updateLane("center");
        } else if (this.currentWord === this.lanes.right.text) {
            // Move car to the right lane
            this.car.x = width - 200;
            this.updateLane("right");
        }
        this.currentWord = ""; // Reset the typed word
    }

    updateLane(newLane) {
        switch (newLane) {
            case "left":
                this.lanes.left.setText(this.getRandomWord(this.LEFT_WORDS));
                break;
            case "right":
                this.lanes.right.setText(this.getRandomWord(this.RIGHT_WORDS));
                break;
            default:
                this.lanes.center.setText(
                    this.getRandomWord(this.CENTER_WORDS)
                );
                break;
        }
    }

    drawMap() {
        // 2D array to represent the map
        const map = [
            [1, 1, 1],
            [0, 0, 0],
            [0, 0, 0],
        ];
        const wordMap = [
            ["a", "a", "a"],
            [0, 0, 0],
            [0, 0, 0],
        ];

        // Cell size for the grid
        const cellSize = 100;

        // Calculate grid dimensions
        const gridWidth = map[0].length * cellSize;
        const gridHeight = map.length * cellSize;

        // Calculate the starting position to center the grid
        const startX = (this.cameras.main.width - gridWidth) / 2;
        const startY = (this.cameras.main.height - gridHeight) / 2;

        // Phaser Graphics object for drawing
        const graphics = this.add.graphics();

        // Loop through the 2D array and draw rectangles with borders
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                // Set fill color based on value
                if (map[y][x] === 1) {
                    graphics.fillStyle(0x00ff00, 1); // Green
                } else {
                    graphics.fillStyle(0x808080, 1); // Grey
                }

                // Calculate the position for each cell
                const posX = startX + x * cellSize;
                const posY = startY + y * cellSize;

                // Draw filled rectangle
                graphics.fillRect(posX, posY, cellSize, cellSize);

                // Set stroke style (black border)
                graphics.lineStyle(2, 0x000000, 1); // Thickness: 2px, Color: Black
                graphics.strokeRect(posX, posY, cellSize, cellSize);

                // Add "Nui" text to the center of each cell
                const text = this.add.text(
                    posX + cellSize / 2, // X position (centered)
                    posY + cellSize / 2, // Y position (centered)
                    wordMap[y][x], // Text content
                    {
                        fontSize: "20px",
                        color: "#000000", // Black text
                        fontFamily: "Arial",
                    }
                );
                text.setOrigin(0.5, 0.5); // Center the text in the cell
            }
        }
    }
}

