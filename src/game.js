/* Canvas */
const canvas = document.querySelector('canvas#canvas')
const ctx = canvas.getContext('2d')

const size = 20
const gap = 1

const width = 18
const height = 15

const displayWidth = width * (gap + size) + 1
const displayHeight = height * (gap + size) + 1

canvas.width = displayWidth
canvas.height = displayHeight
canvas.style.width = displayWidth + 'px'
canvas.style.height = displayHeight + 'px'

function init() {
    const game = new Game()
    drawGrid()
    game.draw()

    const startBtn = document.querySelector('button#start')
    const stopBtn = document.querySelector('button#stop')
    startBtn.addEventListener('click', game.start.bind(game))
    stopBtn.addEventListener('click', game.stop.bind(game))
    document.addEventListener('keydown', game.handleChangeDirection.bind(game))
}

function draw(x, y) {
    ctx.fillRect(x * (size + gap), y * (size + gap), size, size)
}

function clear(x, y) {
    ctx.clearRect(x * (size + gap), y * (size + gap), size, size)
}

function drawGrid() {
    ctx.fillStyle = '#ddd'
    ctx.fillRect(0, 0, displayWidth, displayHeight)

    ctx.fillStyle = 'white'
    for (let y = 0; y < displayHeight; y += size + gap) {
        for (let x = 0; x < displayWidth; x += size + gap) {
            ctx.fillRect(x, y, size, size)
        }
    }
}

/* Utils */

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

/* Game */

const dirs = {
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
        }
    },
}

const dirKeyMap = {
    ArrowUp: dirs.up,
    ArrowDown: dirs.down,
    ArrowLeft: dirs.left,
    ArrowRight: dirs.right,
}

class Food {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Part {
    constructor(x, y, direction) {
        this.x = x
        this.y = y
        this.dir = direction
    }

    move(dir = this.dir) {
        switch (dir) {
            case dirs.up:
                this.y -= 1
                break

            case dirs.down:
                this.y += 1
                break

            case dirs.right:
                this.x += 1
                break

            case dirs.left:
                this.x -= 1
                break
        }
    }

    static getClone(part) {
        return new Part(part.x, part.y, part.dir)
    }
}

class Snake {
    constructor() {
        this.parts = []
        this.parts[0] = new Part(0, 0, dirs.right)
        this.parts[1] = new Part(1, 0, dirs.right)
        this.parts[2] = new Part(2, 0, dirs.right)

        this.newDir = dirs.down
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

    isCrash() {
        const headClone = Part.getClone(this.head)
        headClone.move()

        const isPart = (x, y) => {
            return !!this.parts.find((part) => part.x === x && part.y === y)
        }

        const isWall = (x, y) => {
            return x <= -1 || y <= -1 || x >= width || y >= height
        }

        return isPart(headClone.x, headClone.y) || isWall(headClone.x, headClone.y)
    }
}

class Game {
    constructor() {
        this.snake = new Snake()
        this.food = new Food()
        this.spawnFood()

        this.scoreElement = document.querySelector('#score')
        this.bestElement = document.querySelector('#best')

        this.scoreElement.innerText = 0
        this.bestElement.innerText = localStorage.best || 0
    }

    reset() {
        drawGrid()
        this.snake = new Snake()
        this.food = new Food()
        this.spawnFood()
        this.draw()
        this.scoreElement.innerText = 0
    }

    start() {
        if (this.timer) return

        this.timer = setInterval(() => {
            this.clear()

            this.snake.head.dir = this.snake.newDir

            if (this.snake.isCrash()) {
                this.stop()
                this.reset()
                return
            }

            this.snake.step()

            if (this.isSnakeAte()) {
                this.snake.push()
                this.spawnFood()
                this.score()
            }

            this.draw()
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

    spawnFood() {
        let newX = rand(0, width - 1)
        let newY = rand(0, height - 1)

        const isPart = (x, y) =>
            !!this.snake.parts.find((part) => {
                return part.x === x && part.y === y
            })

        while (isPart(newX, newY)) {
            newX = rand(0, width - 1)
            newY = rand(0, height - 1)
        }

        this.food.x = newX
        this.food.y = newY
    }

    isSnakeAte() {
        return (
            this.snake.head.x === this.food.x &&
            this.snake.head.y === this.food.y
        )
    }

    stop() {
        clearInterval(this.timer)
        this.timer = null
    }

    clear() {
        for (let part of this.snake.parts) {
            clear(part.x, part.y)
        }

        clear(this.food.x, this.food.y)
    }

    draw() {
        ctx.fillStyle = '#0d0'
        for (let part of this.snake.parts) {
            draw(part.x, part.y)
        }

        ctx.fillStyle = '#0a0'
        draw(this.snake.head.x, this.snake.head.y)

        ctx.fillStyle = '#f22'
        draw(this.food.x, this.food.y)
    }

    handleChangeDirection(event) {
        const newDir = dirKeyMap[event.code]

        if (
            dirs.revert(newDir) === this.snake.head.dir ||
            newDir === this.snake.head.dir
        ) return

        this.snake.newDir = newDir
    }
}

init()
