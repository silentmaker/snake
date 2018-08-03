import React, { Component } from 'react'
import * as p5 from 'p5'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.painter = null
    this.columns = 40
    this.snake = {
      x: 1,
      y: 1,
      xspeed: 1,
      yspeed: 0,
      bodies: [],
      length: 0
    }
    this.food = {x: 0, y: 0}
    this.orientation = ''
    this.gridSize = 0

    this.setup = this.setup.bind(this)
    this.draw = this.draw.bind(this)
    this.keyPressed = this.keyPressed.bind(this)
    this.turn = this.turn.bind(this)
    this.over = this.over.bind(this)
  }
  componentDidMount() {
    const {innerWidth, innerHeight} = window
    
    this.gridSize = Math.min(innerWidth, innerHeight) / this.columns
    this.orientation= innerHeight > innerWidth ? 'portrait' : 'landscape'

    new p5((p) => {
      this.painter = p;
      p.setup = this.setup
      p.draw = this.draw
    }, document.getElementById('snake-game'))

    document.onkeydown = this.keyPressed
  }
  setup() {
    this.painter.frameRate(8)
    this.painter.createCanvas(window.innerWidth, window.innerWidth)
    this.createFood()
  }
  draw() {
    const {painter, snake, food, gridSize, columns} = this
   
    painter.background(0)

    snake.bodies.unshift({x: snake.x, y: snake.y})
    if (snake.bodies.length < snake.length) {
      snake.bodies.pop()
    }

    const x = snake.x + snake.xspeed
    const y = snake.y + snake.yspeed
    if (x < 0 || y < 0 || x >= columns || y >= columns) {
      this.over()
    } else {
      snake.x = x
      snake.y = y
    }
    painter.fill(255)
    painter.rect(snake.x * gridSize, snake.y * gridSize, gridSize, gridSize)
    for (let i = 0; i < snake.length; i++) {
      painter.rect(snake.bodies[i].x * gridSize, snake.bodies[i].y * gridSize, gridSize, gridSize)
    }


    if (snake.x === food.x && snake.y === food.y) {
      snake.length += 1
      this.createFood()
    }
    painter.fill('red')
    painter.rect(food.x * gridSize, food.y * gridSize, gridSize, gridSize)
  }
  createFood() {
    const {painter, food, columns} = this

    food.x = painter.floor(painter.random(1, columns - 1))
    food.y = painter.floor(painter.random(1, columns - 1))
  }
  keyPressed(e) {
    const {turn} = this;

    switch (e.keyCode) {
      case 38:
        turn('up')
        break
      case 40:
        turn('down')
        break
      case 37:
        turn('left')
        break
      case 39:
        turn('right')
        break
      default:
        break
    }
  }
  turn(dir) {
    const {snake} = this
    const xspeed = dir === 'left' ? -1 : (dir === 'right' ? 1 : 0)
    const yspeed = dir === 'up' ? -1 : (dir === 'down' ? 1 : 0)

    if (xspeed !== -snake.xspeed || yspeed !== -snake.yspeed) {
      snake.xspeed = xspeed
      snake.yspeed = yspeed
    }
  }
  over() {
    this.painter.noLoop()
  }
  componentWillUnmount() {
    document.onkeydown = null
  }
  render() {
    const {turn} = this;

    return (
      <div>
        <div id="snake-game"></div>
        <div id="controls">
          <div className="control up" onClick={() => turn('up')}>上</div>
          <div className="control left" onClick={() => turn('left')}>左</div>
          <div className="control right" onClick={() => turn('right')}>右</div>
          <div className="control down" onClick={() => turn('down')}>下</div>
        </div>
      </div>
    )
  }
}

export default App
