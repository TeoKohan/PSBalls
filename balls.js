

var framerate = 60;
var interval = 0.01;
var max_balls;
var floor;
var mouse_held = false;

class Ball {
  
  constructor(radius, elasticity, ball_color) {
    this.radius = radius;
    this.elasticity = elasticity;
    this.ball_color = ball_color;
    
    this.location = createVector(random(0, windowWidth), random(radius, windowHeight-radius-floor));
    this.speed = createVector(random(-1, 1) * 5, random(-1, 1) * 5);
    this.acceleration = createVector(0, 0);
  }
  
  update() {
    var mouse = createVector(mouseX, mouseY);
    var to = mouse.copy().sub(this.location);
    var distance = to.mag();
    if (distance <= 300) {
      stroke(red(this.ball_color), green(this.ball_color), blue(this.ball_color), mouse_held ? 128 : 25);
      strokeWeight(mouse_held ? 5 : 2);
      line(this.location.x, this.location.y, mouse.x, mouse.y);
      noStroke();
      if (mouse_held) {
        var mouse_accel = mouse.sub(this.location).mult(100/this.radius/this.radius);
        this.acceleration.add(mouse_accel);
      }
    }
    this.acceleration.add(this.gravity());
    this.speed.add(this.acceleration);
    this.speed.setMag(constrain(this.speed.mag(), -25, 25));
    this.location.add(this.speed);
    this.move();
    this.acceleration = createVector(0, 0);
  }
  
  gravity() {
    return createVector(0, 9.8).mult(2/framerate);
  }
  
  move() {
    this.location.x = (windowWidth + this.location.x) % windowWidth;
    
    if (this.location.y > (windowHeight-floor-this.radius/2)) {
      this.location.y = windowHeight-floor-this.radius/2-(this.location.y - (windowHeight-floor-this.radius/2));
      this.bounce();
    }
  }
  
  bounce() {
    this.acceleration.y = 0;
    this.speed.x *= constrain(this.elasticity, 0.8, 1);
    this.speed.y *= (this.speed.y <= 3) ? 0 : -this.elasticity;
  }
  
  draw_ball() {
    fill(this.ball_color);
    ellipse(this.location.x, this.location.y, this.radius, this.radius);
    if (this.location.x > windowWidth-this.radius/2) { ellipse((-windowWidth+this.location.x), this.location.y, this.radius, this.radius); }
    else if(this.location.x < this.radius/2) { ellipse((windowWidth+this.location.x), this.location.y, this.radius, this.radius); }
  }
}

var balls = [];
var opacity;
var next_spawn;

function random_bell() {
    var u = 0, v = 0;
    while(u === 0) {u = random();} //Converting [0,1) to (0,1)
    while(v === 0) {v = random();}
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function mousePressed() {
  mouse_held = true;
}

function mouseReleased() {
  mouse_held = false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  floor = windowHeight / 10;
  framerate = 60;
  frameRate(framerate);
  noStroke();
  max_balls = random(1, 500);
  opacity = constrain(16/max_balls*255, 128, 255);
  mouseX = windowWidth/2;
  mouseY = windowHeight/2;
  add_ball();
}

function add_ball() {
  var ball_color = color(random(255), random(255), random(255), opacity);
  ball = new Ball(abs(random_bell()*50+windowWidth/50), random(0.5, 0.95), ball_color);
  balls.push(ball);
  next_spawn = (second() + (millis()/1000) + interval) % 60;
}

function draw() {
  background(0);
  if ((second() + (millis()/1000)) >= next_spawn && (balls.length < max_balls)) { add_ball(); }
  fill(255, 255, 255, opacity);
  rect(0, windowHeight-floor, windowWidth, floor);
  
  for (i = 0; i < balls.length; i++) {
    ball = balls[i];
    ball.update();
    ball.draw_ball();
  }
}
