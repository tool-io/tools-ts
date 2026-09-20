import { runLinear } from "../interpolation/linear/tool.js";
import { calculateDistance } from "../geometry/distance/tool.js";
import { calculatePolylineLength } from "../geometry/polyline-length/tool.js";
import { simpleError } from "../core/simple.js";
export type GeneratedDrawingPoint = { readonly x: number; readonly y: number };
export const generatedDrawingPointSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
} as const;
export const generatedSvgSchema = {
  type: "string",
  minLength: 1,
  maxLength: 262144,
  format: "image/svg+xml",
} as const;
export const generatedLinearValue = (
  start: number,
  end: number,
  parameter: number,
  field: string,
): number => {
  const scale = Number.isFinite(end - start)
    ? 1
    : Math.max(Math.abs(start), Math.abs(end));
  const result = runLinear({
    start: start / scale,
    end: end / scale,
    parameter,
  });
  if (!result.ok)
    throw new Error(
      "Validated interpolation inputs were rejected by the linear core.",
    );
  const value = (result.output.value as number) * scale;
  if (!Number.isFinite(value))
    return simpleError(
      field,
      "The interpolated value is not representable as a finite number.",
      "numeric_overflow",
    );
  return value === 0 ? 0 : value;
};
export const generatedDrawingDistance = (
  first: GeneratedDrawingPoint,
  last: GeneratedDrawingPoint,
  field: string,
): number => {
  let value = calculateDistance({
    mode: "2d-euclidean",
    point1A: first.x,
    point1B: first.y,
    point2A: last.x,
    point2B: last.y,
  });
  if (value !== null && Number.isFinite(value)) return value;
  const scale = Math.max(
    Math.abs(first.x),
    Math.abs(first.y),
    Math.abs(last.x),
    Math.abs(last.y),
  );
  value = calculateDistance({
    mode: "2d-euclidean",
    point1A: first.x / scale,
    point1B: first.y / scale,
    point2A: last.x / scale,
    point2B: last.y / scale,
  });
  const distance = value === null ? NaN : value * scale;
  if (!Number.isFinite(distance))
    return simpleError(
      field,
      "The geometric distance is not representable as a finite number.",
      "numeric_overflow",
    );
  return distance;
};
export const generatedPolylineLength = (
  points: readonly GeneratedDrawingPoint[],
  field: string,
): number => {
  if (points.length < 2) return 0;
  const xs = points.map((point) => point.x),
    ys = points.map((point) => point.y);
  let length = calculatePolylineLength({ xs, ys }).length;
  if (Number.isFinite(length)) return length;
  const scale = Math.max(...xs.map(Math.abs), ...ys.map(Math.abs));
  length =
    calculatePolylineLength({
      xs: xs.map((x) => x / scale),
      ys: ys.map((y) => y / scale),
    }).length * scale;
  if (!Number.isFinite(length))
    return simpleError(
      field,
      "The polyline length is not representable as a finite number.",
      "numeric_overflow",
    );
  return length;
};
