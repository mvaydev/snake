export const colors = Object.freeze({
    grid: '#ddd',
    cell: 'white',
    snakeBody: '#0d0',
    snakeHead: '#0a0',
    food: '#f22'
})

/**
 * @param width cells per row
 * @param height cells per column
 * @param size cells size in px
 * @param gap grid size
*/
export class GameCanvas {
    constructor(width = 15, height = 15, size = 16, gap = 1) {
        this.canvas = document.querySelector('canvas#canvas')
        this.ctx = this.canvas.getContext('2d')

        this.size = size
        this.gap = gap
        this.fullSize = gap + size

        this.width = width
        this.height = height

        this.displayWidth = width * (gap + size) + 1
        this.displayHeight = height * (gap + size) + 1

        this.canvas.width = this.displayWidth
        this.canvas.height = this.displayHeight
        this.canvas.style.width = this.displayWidth + 'px'
        this.canvas.style.height = this.displayHeight + 'px'
    }

    draw(x, y, color = null) {
        this.ctx.fillStyle = color ? color : this.ctx.fillStyle
        this.ctx.fillRect(x * this.fullSize, y * this.fullSize, this.size, this.size)
    }

    clear(x, y) {
        this.ctx.clearRect(x * this.fullSize, y * this.fullSize, this.size, this.size)
    }

    drawGrid() {
        this.ctx.fillStyle = colors.grid
        this.ctx.fillRect(0, 0, this.displayWidth, this.displayHeight)

        this.ctx.fillStyle = colors.cell
        for (let y = 0; y < this.displayHeight; y += this.fullSize) {
            for (let x = 0; x < this.displayWidth; x += this.fullSize) {
                this.ctx.fillRect(x, y, this.size, this.size)
            }
        }
    }
}