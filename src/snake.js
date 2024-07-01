import { dirs } from "./game"
import { Part } from "./part"
import { colors } from "./canvas"

export class Snake {
    constructor(gameCanvas) {
        this.parts = []
        this.parts.push(new Part(0, 0, dirs.right))
        this.parts.push(new Part(1, 0, dirs.right))
        this.parts.push(new Part(2, 0, dirs.right))

        this.newDir = dirs.right

        this.gameCanvas = gameCanvas
    }

    get head() {
        return this.parts[this.parts.length - 1]
    }

    get tail() {
        return this.parts[0]
    }

    push() {
        const part = Part.getClone(this.tail)
        part.move(dirs.revert(this.tail.dir))
        this.parts.unshift(part)
    }

    step() {
        for (let i = 0; i < this.parts.length; i++) {
            const part = this.parts[i]

            part.move()
            if (i != this.parts.length - 1) part.dir = this.parts[i + 1].dir
        }
    }

    changeDirection(dir) {
        this.head.dir = dir
    }

    isCrash() {
        const headClone = Part.getClone(this.head)
        headClone.move()

        const isPart = (x, y) => {
            return !!this.parts.find((part) => part.x === x && part.y === y)
        }

        const isWall = (x, y) => {
            return x <= -1 || y <= -1 || x >= this.gameCanvas.width || y >= this.gameCanvas.height
        }

        return isPart(headClone.x, headClone.y) || isWall(headClone.x, headClone.y)
    }

    isAte(food) {
        return food.x === this.head.x && food.y === this.head.y
    }

    draw() {
        for (let part of this.parts) {
            this.gameCanvas.draw(part.x, part.y, colors.snakeBody)
        }

        this.gameCanvas.draw(this.head.x, this.head.y, colors.snakeHead)
    }

    clear() {
        for (let part of this.parts) {
            this.gameCanvas.clear(part.x, part.y)
        }
    }
}