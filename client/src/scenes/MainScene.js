import { Scene } from "phaser";

export class MainScene extends Scene {
    player = {
        currentPosition: { x: 0, y: 0 },
        color: 0x00ff00,
    };
    car = null;
    lanes = { left: null, center: null, right: null };
    currentLane = "center";
    currentWord = "";
    points = 0;

    // Words for each lane
    LEFT_WORDS = ["sad", "fad", "gas", "dad", "add"];
    CENTER_WORDS = ["kite", "bite", "site", "time", "lime"];
    RIGHT_WORDS = ["pool", "cool", "tool", "fool", "doll"];

    map = [
        [1, 1, 1],
        [1, 0, 0],
        [0, 0, 0],
    ];
    wordMap = [
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
    ];

    boundary = { x: 3, y: 3 };

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");
    }

    create() {
        // Background
        // this.add.image(0, 0, "background").setOrigin(0, 0);

        this.drawMap(this.map, this.wordMap);

        const { width, height } = this.cameras.main;

        // Add word on each lane
        // this.lanes.left = this.add.text(
        //     200,
        //     100,
        //     this.getRandomWord(this.LEFT_WORDS),
        //     {
        //         fontSize: "32px",
        //         fill: "#fff",
        //     }
        // );
        // this.lanes.center = this.add
        //     .text(width / 2, 100, this.getRandomWord(this.CENTER_WORDS), {
        //         fontSize: "32px",
        //         fill: "#fff",
        //     })
        //     .setOrigin(0.5, 0);
        // this.lanes.right = this.add.text(
        //     width - 200,
        //     100,
        //     this.getRandomWord(this.RIGHT_WORDS),
        //     {
        //         fontSize: "32px",
        //         fill: "#fff",
        //     }
        // );

        // Add car (rectangle)
        // this.car = this.add.rectangle(
        //     width / 2,
        //     height - 100,
        //     50,
        //     100,
        //     0x61dafb
        // );

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
                .text(width / 2, height - 10, "", {
                    fontSize: "32px",
                    fill: "#fff",
                })
                .setOrigin(0.5);
        });
    }

    update() {
        this.currentWordText.setText(this.currentWord);
        this.drawMap();
    }

    getRandomWord(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    checkWord() {
        const player = this.player;
        const currentX = player.currentPosition.x;
        const currentY = player.currentPosition.y;
        const {
            upper: upperWord,
            lower: lowerWord,
            right: rightWord,
            left: leftWord,
        } = this.getAllDirectWords(currentX, currentY);

        let correct = false;
        if (rightWord && this.currentWord == rightWord) {
            player.currentPosition.x = currentX + 1;
            correct = true;
        } else if (leftWord && this.currentWord == leftWord) {
            player.currentPosition.x = currentX - 1;
            correct = true;
        } else if (upperWord && this.currentWord == upperWord) {
            player.currentPosition.y = currentY - 1;
            correct = true;
        } else if (lowerWord && this.currentWord == lowerWord) {
            player.currentPosition.y = currentY + 1;
            correct = true;
        }

        if (correct) {
           this.increasePoint();
        }

        this.currentWord = "";
    }

    getNearByWord({ x, y }) {
        const wordMap = this.wordMap;
        if (this.isIndexInbound(x, y)) {
            return wordMap[y][x];
        }

        return null;
    }

    isIndexInbound(x, y) {
        const boundary = this.boundary;
        return x < boundary.x && x >= 0 && y < boundary.y && y >= 0;
    }

    drawMap() {
        const map = this.map;
        const wordMap = this.wordMap;
        const player = this.player;
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

        const availableColorCode = 0xceeece;
        const unavailableColorCode = 0x808080;

        // Loop through the 2D array and draw rectangles with borders
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const isCurrentPlayerPosition =
                    player.currentPosition.x == x &&
                    player.currentPosition.y == y;
                // Set fill color based on value
                if (map[y][x] == 1) {
                    if (isCurrentPlayerPosition) {
                        graphics.fillStyle(player.color, 1);
                    } else {
                        graphics.fillStyle(availableColorCode, 1);
                    }
                } else {
                    graphics.fillStyle(unavailableColorCode, 1);
                }

                // Calculate the position for each cell
                const posX = startX + x * cellSize;
                const posY = startY + y * cellSize;

                // Draw filled rectangle
                graphics.fillRect(posX, posY, cellSize, cellSize);

                // Set stroke style (black border)
                graphics.lineStyle(2, 0x000000, 1);
                graphics.strokeRect(posX, posY, cellSize, cellSize);

                const word = isCurrentPlayerPosition ? "🚘" : wordMap[y][x];
                const text = this.add.text(
                    posX + cellSize / 2,
                    posY + cellSize / 2,
                    word,
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

    getUpperPosition(x, y) {
        return { x, y: y - 1 };
    }

    getLowerPosition(x, y) {
        return { x, y: y + 1 };
    }

    getRightPosition(x, y) {
        return { x: x + 1, y };
    }

    getLeftPosition(x, y) {
        return { x: x - 1, y };
    }

    getIndexPosition(x, y) {
        return {
            upper: this.getUpperPosition(x, y),
            lower: this.getLowerPosition(x, y),
            right: this.getRightPosition(x, y),
            left: this.getLeftPosition(x, y),
        };
    }

    getAllDirectWords(x, y) {
        const {
            upper: upperPos,
            lower: lowerPos,
            right: rightPos,
            left: leftPos,
        } = this.getIndexPosition(x, y);

        return {
            upper: this.getNearByWord(upperPos),
            lower: this.getNearByWord(lowerPos),
            left: this.getNearByWord(leftPos),
            right: this.getNearByWord(rightPos),
        };
    }

    increasePoint() {
        this.scene.get("HudScene").update_points(++this.points);
    }
}

