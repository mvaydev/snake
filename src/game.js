import { Snake } from './snake'
import { Food } from './food'
import { GameCanvas } from './canvas'

/**
 * Snake move directions
 */
export const dirs = Object.freeze({
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right',
    revert(dir) {
        switch (dir) {
            case this.up:
                return this.down
            case this.down:
                return this.up
            case this.left:
                return this.right
            case this.right:
                return this.left
            default:
                return dir
        }
    },
})

/**
 * Represents keyboard's key codes as directions
*/
export const dirKeyMap = Object.freeze({
    ArrowUp: dirs.up,
    ArrowDown: dirs.down,
    ArrowLeft: dirs.left,
    ArrowRight: dirs.right,
    KeyW: dirs.up,
    KeyS: dirs.down,
    KeyA: dirs.left,
    KeyD: dirs.right,
})

export class Game {
    constructor() {
        this.gameCanvas = new GameCanvas()
        this.snake = new Snake(this.gameCanvas)
        this.food = new Food(this.gameCanvas)

        this.scoreElement = document.querySelector('#score')
        this.bestElement = document.querySelector('#best')

        this.scoreElement.innerText = 0
        this.bestElement.innerText = localStorage.best || 0
    }

    init() {
        this.gameCanvas.drawGrid()

        const startBtn = document.querySelector('button#start')
        const stopBtn = document.querySelector('button#stop')

        startBtn.addEventListener('click', this.start.bind(this))
        stopBtn.addEventListener('click', this.stop.bind(this))
        document.addEventListener('keydown', this.handleChangeDirection.bind(this))
    }

    reset() {
        this.gameCanvas.drawGrid()

        this.snake = new Snake(this.gameCanvas)
        this.snake.draw()

        this.food = new Food(this.gameCanvas)
        this.food.spawn(this.snake.parts)

        this.scoreElement.innerText = 0
    }

    start() {
        if (this.timer) return

        this.food.spawn(this.snake.parts)

        this.timer = setInterval(() => {
            this.snake.clear()

            if (this.snake.isCrash()) {
                this.stop()
                this.reset()
                return
            }

            this.snake.step()

            if (this.snake.isAte(this.food)) {
                this.snake.push()
                this.food.spawn(this.snake.parts)
                this.score()
            }

            this.snake.draw()
        }, 250)
    }

    score() {
        const bestScore = localStorage.best || 0
        const newScore = this.snake.parts.length - 3

        this.scoreElement.innerText = newScore

        if (bestScore < newScore) {
            localStorage.best = newScore
            this.bestElement.innerText = newScore
        }

    }

    stop() {
        clearInterval(this.timer)
        this.timer = null
    }

    handleChangeDirection(event) {
        const newDir = dirKeyMap[event.code]

        if (
            dirs.revert(newDir) === this.snake.head.dir ||
            newDir === this.snake.head.dir
        ) return

        this.snake.changeDirection(newDir)
    }
}