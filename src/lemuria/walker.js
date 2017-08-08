function uniformGenerator(min, max) {
  return () => {
    return {
      x: Math.random() * (max - min) + min,
      y: Math.random() * (max - min) + min
    };
  };
}

class screenArea {
  constructor(points) {
    this.points = points;
  }

  // Check if a given location in contained within the map area
  // base on ray-casting algorithm
  contains({ x, y }) {
    // let inside = false;
    // for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
    //   const xi = this.points[i][0], yi = this.points[i][1];
    //   const xj = this.points[j][0], yj = this.points[j][1];
    //   const intersect = ((yi > x) != (yj > x))
    //       && (y < (xj - xi) * (x - yi) / (yj - yi) + xi);
    //   if (intersect) inside = !inside;
    // }
    // return inside;
    if (
      x >= this.points.x[0] &&
      x <= this.points.x[1] &&
      y >= this.points.y[0] &&
      y <= this.points.y[1]
    )
      return true;
    return false;
  }
}

// const fullScreenArea = new screenArea([
//   [ 0, 0 ],
//   [ 0, window.innerHeight ],
//   [ window.innerWidth, window.innerHeight ],
//   [ window.innerWidth, 0 ]
// ]);
const fullScreenArea = new screenArea({
  x: [0, window.innerWidth],
  y: [0, window.innerHeight]
});

export default class Walker {
  /**
     * @param {Number} - Resolution ('step size') at which the walker moves
     *                   Adjust it upon creation to fit to your walking space.
     * @param {Object} - Initial position and veolocity (x,y coordinates)
     * @param {Function} - Random generator, used for updating acceleration
     * @param {Function} - A polygon instance, given as array of points, the walker is limit to walk in
     */
  constructor(
    resolution = 1,
    { initPosX = 0, initPosY = 0, initVelX = 0, initVelY = 0 } = {},
    accelerationRandomGenerator = uniformGenerator(-0.5, 0.5),
    delimitTo = fullScreenArea
  ) {
    const { x: initAccX, y: initAccY } = accelerationRandomGenerator();

    // Composition of behaviour (strategy)
    this.accelerationRandomGenerator = accelerationRandomGenerator;
    // Constant attributes
    this.resolution = resolution;
    // State
    this.state = {
      pos: {
        x: initPosX,
        y: initPosY
      },
      vel: {
        x: initVelX,
        y: initVelY
      },
      acc: {
        x: initAccX,
        y: initAccY
      },
      timestamp: Date.now()
    };
    // The bounds a walker is limited to walk into
    this.delimitTo = delimitTo;
  }

  /**
     * Update walker position & velocity & acceleration
     */
  walk() {
    // Update position and velocity
    updateWalkerPosition(this.state, this.resolution, this.delimitTo);
    // Updtate walker acceleration (random)
    this.state.acc = this.accelerationRandomGenerator();
  }

  /**
     * Returns walker's position {x,y}
     * @getter
     */
  get position() {
    return this.state.pos;
  }
}

///////////////////////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////////////////////
function updateWalkerPosition(walkerState, resolution, areaToDelimit) {
  // Two impurities here:
  // - Consciously mutates! walker's state and returns reference to it
  // - Gets current time with Date.now()

  //
  // Update timestamp and get time interval
  //
  const now = Date.now();
  const interval_ms = now - walkerState.timestamp;
  // Mutate!
  walkerState.timestamp = now;

  //
  // Update position
  //
  const x = walkerState.vel.x * interval_ms * resolution + walkerState.pos.x;
  const y = walkerState.vel.y * interval_ms * resolution + walkerState.pos.y;
  //
  // Update velocity
  //
  walkerState.vel.x = walkerState.acc.x * interval_ms + walkerState.vel.x;
  walkerState.vel.y = walkerState.acc.y * interval_ms + walkerState.vel.y;

  if (walkerState.vel.x > 100) {
    walkerState.vel.x = 100;
  }

  if (walkerState.vel.x < -100) {
    walkerState.vel.x = -100;
  }

  if (walkerState.vel.y > 100) {
    walkerState.vel.y = 100;
  }

  if (walkerState.vel.y < -100) {
    walkerState.vel.y = -100;
  }

  if (areaToDelimit && !areaToDelimit.contains({ x, y })) {
    walkerState.vel.x = -walkerState.vel.x;
    walkerState.vel.y = -walkerState.vel.y;
    return walkerState;
  }

  walkerState.pos.y = y;
  walkerState.pos.x = x;

  return walkerState;
}
