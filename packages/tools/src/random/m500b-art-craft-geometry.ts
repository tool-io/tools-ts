import {
  calculateBoundingBox,
  type BoundingBoxOutput,
} from "../geometry/bounding-box/tool.js";
import { calculateRectangleArea } from "../geometry/rectangle-area/tool.js";
import {
  array,
  object,
  num,
  finite,
  positive,
  simpleError,
  limit,
} from "./m500b-art-craft-common.js";
export type Point = readonly [number, number];
export type Box = BoundingBoxOutput;
export const pointSchema = array(num, 2, 2);
export const pointsSchema = array(pointSchema, 128, 1);
export const boxSchema = object({
  minX: num,
  minY: num,
  maxX: num,
  maxY: num,
  width: num,
  height: num,
});
export const rectSchema = object({
  x: num,
  y: num,
  width: positive,
  height: positive,
});
export type Rect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};
export const point = (x: number, y: number): Point => [finite(x), finite(y)];
/** Exact cardinal cases, without display rounding or near-axis snapping. */
export const trig = (turns: number): Point => {
  const t = finite(turns) % 1;
  if (t === 0) return [1, 0];
  if (t === 0.25 || t === -0.75) return [0, 1];
  if (t === 0.5 || t === -0.5) return [-1, 0];
  if (t === 0.75 || t === -0.25) return [0, -1];
  return point(Math.cos(t * 2 * Math.PI), Math.sin(t * 2 * Math.PI));
};
export const rotate = ([x, y]: Point, turns: number): Point => {
  const [c, s] = trig(turns);
  return point(x * c - y * s, x * s + y * c);
};
export const bounds = (points: readonly Point[]): Box => {
  points.forEach(([x, y]) => {
    finite(x);
    finite(y);
  });
  const b = calculateBoundingBox({ points });
  return {
    minX: finite(b.minX),
    minY: finite(b.minY),
    maxX: finite(b.maxX),
    maxY: finite(b.maxY),
    width: finite(b.width),
    height: finite(b.height),
  };
};
export const area = (width: number, height: number): number => {
  const value = finite(calculateRectangleArea({ width, height }).area);
  if (value <= 0)
    return simpleError(
      "dimensions",
      "Positive area is below numeric resolution.",
      "numeric_resolution",
    );
  return value;
};
export const overlap = (a: Rect, b: Rect, gap = 0): boolean =>
  a.x < b.x + b.width + gap &&
  b.x < a.x + a.width + gap &&
  a.y < b.y + b.height + gap &&
  b.y < a.y + a.height + gap;
export const inside = (r: Rect, width: number, height: number): boolean =>
  r.x >= 0 &&
  r.y >= 0 &&
  finite(r.x + r.width) <= width &&
  finite(r.y + r.height) <= height;
export type Segment = { readonly from: Point; readonly to: Point };
export const segmentSchema = object({ from: pointSchema, to: pointSchema });
export const clipSegment = (segment: Segment, r: Rect): Segment | null => {
  let lo = 0,
    hi = 1;
  const delta = point(
    segment.to[0] - segment.from[0],
    segment.to[1] - segment.from[1],
  );
  for (const [p, d, minimum, maximum] of [
    [segment.from[0], delta[0], r.x, finite(r.x + r.width)],
    [segment.from[1], delta[1], r.y, finite(r.y + r.height)],
  ]) {
    if (d === 0) {
      if (p < minimum || p > maximum) return null;
    } else {
      const a = finite((minimum - p) / d),
        b = finite((maximum - p) / d);
      lo = Math.max(lo, Math.min(a, b));
      hi = Math.min(hi, Math.max(a, b));
    }
  }
  return lo > hi
    ? null
    : {
        from: point(
          segment.from[0] + lo * delta[0],
          segment.from[1] + lo * delta[1],
        ),
        to: point(
          segment.from[0] + hi * delta[0],
          segment.from[1] + hi * delta[1],
        ),
      };
};
/** Slab clip of an infinite line n.p=offset to a closed rectangle. */
export const clipLine = (
  r: Rect,
  turns: number,
  offset: number,
): Segment | null => {
  const [dx, dy] = trig(turns),
    nx = -dy,
    ny = dx;
  const origin = point(nx * offset, ny * offset);
  let lo = -Infinity,
    hi = Infinity;
  for (const [p, d, minimum, maximum] of [
    [origin[0], dx, r.x, finite(r.x + r.width)],
    [origin[1], dy, r.y, finite(r.y + r.height)],
  ]) {
    if (d === 0) {
      if (p < minimum || p > maximum) return null;
    } else {
      const a = finite((minimum - p) / d),
        b = finite((maximum - p) / d);
      lo = Math.max(lo, Math.min(a, b));
      hi = Math.min(hi, Math.max(a, b));
    }
  }
  return lo > hi
    ? null
    : {
        from: point(origin[0] + lo * dx, origin[1] + lo * dy),
        to: point(origin[0] + hi * dx, origin[1] + hi * dy),
      };
};
export const hatchRange = (
  r: Rect,
  turns: number,
  spacing: number,
  offset: number,
): readonly [number, number] => {
  const [dx, dy] = trig(turns);
  const projections = [
    [r.x, r.y],
    [finite(r.x + r.width), r.y],
    [r.x, finite(r.y + r.height)],
    [finite(r.x + r.width), finite(r.y + r.height)],
  ].map(([x, y]) => finite(-dy * x + dx * y));
  const first = Math.ceil(
      finite((Math.min(...projections) - offset) / spacing),
    ),
    last = Math.floor(finite((Math.max(...projections) - offset) / spacing));
  if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last))
    return simpleError(
      "spacing",
      "Line index is outside safe integer resolution.",
      "numeric_resolution",
    );
  limit(Math.max(0, last - first + 1));
  return [first, last];
};
export const hatches = (
  r: Rect,
  turns: number,
  spacing: number,
  offset = 0,
): Segment[] => {
  const [first, last] = hatchRange(r, turns, spacing, offset),
    lines: Segment[] = [];
  for (let k = first; k <= last; k++) {
    const s = clipLine(r, turns, finite(offset + k * spacing));
    if (s) lines.push(s);
  }
  return lines;
};
