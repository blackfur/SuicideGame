export function add(a, ...args) {
  const n = a.slice();
  [...args].forEach(p => {
    n[0] += p[0];
    n[1] += p[1];
  });
  return n;
}

export function sub(a, ...args) {
  const n = a.slice();
  [...args].forEach(p => {
    n[0] -= p[0];
    n[1] -= p[1];
  });
  return n;
}

export function mult(a, s) {
  if (Array.isArray(s)) {
    let t = s;
    s = a;
    a = t;
  }
  if (Array.isArray(s)) {
    return [
      a[0] * s[0],
      a[1] * s[1],
    ];
  } else {
    return [a[0] * s, a[1] * s];
  }
}

export function lerp(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
}

export function min(a, b) {
  return [
    Math.min(a[0], b[0]),
    Math.min(a[1], b[1]),
  ];
}

export function max(a, b) {
  return [
    Math.max(a[0], b[0]),
    Math.max(a[1], b[1]),
  ];
}

// compute the distance squared between a and b
export function distanceSq(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

// compute the distance between a and b
export function distance(a, b) {
  return Math.sqrt(distanceSq(a, b));
}

// compute the distance squared from p to the line segment
// formed by v and w
export function distanceToSegmentSq(p, v, w) {
  const l2 = distanceSq(v, w);
  if (l2 == 0) {
    return distanceSq(p, v);
  }
  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return distanceSq(p, lerp(v, w, t));
}

// compute the distance from p to the line segment
// formed by v and w
export function distanceToSegment(p, v, w) {
  return Math.sqrt(distanceToSegmentSq(p, v, w));
}
