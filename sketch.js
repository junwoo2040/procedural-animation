/* World */
const PIXELS_PER_METER = 32;
const WORLD_WIDTH = 20;
const WORLD_HEIGHT = 20;
const DEBUG = true;

/* Control */
let control;
let speed = 10;

/* Target */
let targetPos;
let targetRad = 0.5;

/* Follower */
let followerPos, followerVel, followerAcc;
let followerRad = 1;

let f = 0.5;
let z = 0.5;
let r = 0.5;

let k1, k2, k3;

function setup() {
  createCanvas(WORLD_WIDTH * PIXELS_PER_METER, WORLD_HEIGHT * PIXELS_PER_METER);
  targetPos = createVector(0.5 * WORLD_WIDTH, 0.5 * WORLD_HEIGHT);
  control = createVector(0, 0);
  followerPos = createVector(0.5 * WORLD_WIDTH, 0.5 * WORLD_HEIGHT);
  followerVel = createVector(0, 0);
  followerAcc = createVector(0, 0);

  k1 = z / (PI * f);
  k2 = 1 / (2 * PI * f * (2 * PI * f));
  k3 = (r * z) / (2 * PI * f);
}

function draw() {
  /* Update */

  /* Recalculate delta time in ms */
  const dt = deltaTime * 0.001;

  /* Update control */
  control
    .set(keyIsDown(68) - keyIsDown(65), keyIsDown(83) - keyIsDown(87))
    .normalize();

  /* Update target position */
  let prevTargetPos = targetPos.copy();
  targetPos.add(control.copy().mult(speed * dt));
  let targetCurVel = targetPos
    .copy()
    .sub(prevTargetPos)
    .mult(1 / dt);

  /* Update follower position */
  followerPos.add(followerVel.copy().mult(dt));
  followerVel.add(
    targetPos
      .copy()
      .add(targetCurVel.copy().mult(k3))
      .sub(followerPos)
      .sub(followerVel.copy().mult(k1))
      .mult(dt / k2),
  );

  /* Draw */

  /* Clear canvas */
  background(0);

  /* Draw follower */
  noStroke();
  fill(255);
  ellipse(
    followerPos.x * PIXELS_PER_METER,
    followerPos.y * PIXELS_PER_METER,
    followerRad * PIXELS_PER_METER,
    followerRad * PIXELS_PER_METER,
  );

  /* Draw debug */

  if (DEBUG) {
    /* Target outline  */
    stroke(0, 255, 0);
    strokeWeight(2);
    noFill();
    ellipse(
      targetPos.x * PIXELS_PER_METER,
      targetPos.y * PIXELS_PER_METER,
      targetRad * PIXELS_PER_METER,
      targetRad * PIXELS_PER_METER,
    );

    /* Input direction */
    stroke(255, 0, 0);
    strokeWeight(2);
    line(
      targetPos.x * PIXELS_PER_METER,
      targetPos.y * PIXELS_PER_METER,
      (targetPos.x + control.x) * PIXELS_PER_METER,
      (targetPos.y + control.y) * PIXELS_PER_METER,
    );
  }
}
