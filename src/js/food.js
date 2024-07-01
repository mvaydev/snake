import { colors, imgs } from "./canvas"

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

export class Food {
    constructor(gameCanvas) {
        this.gameCanvas = gameCanvas
    }

    spawn(parts) {
        let newX = rand(0, this.gameCanvas.width - 1)
        let newY = rand(0, this.gameCanvas.height - 1)

        const isPart = (x, y) =>
            !!parts.find((part) => {
                return part.x === x && part.y === y
            })

        while (isPart(newX, newY)) {
            newX = rand(0, this.gameCanvas.width - 1)
            newY = rand(0, this.gameCanvas.height - 1)
        }

        this.clear()
        this.x = newX
        this.y = newY
        this.draw()
    }

    draw() {
        this.gameCanvas.drawImage(this.x, this.y, imgs.apple)
    }

    clear() {
        this.gameCanvas.clear(this.x, this.y)
    }
}