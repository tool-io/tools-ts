import { describe, expect, it } from "vitest";
import { pointInPolygonExample, runPointInPolygon } from "./tool.js";

describe("geometry/point-in-polygon", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPointInPolygon(pointInPolygonExample.input)).toEqual({
      ok: true,
      output: pointInPolygonExample.output,
    });
  });

  it("flags boundary points and vertices as inside", () => {
    const edge = runPointInPolygon({ x: 0, y: 1 });
    const vertex = runPointInPolygon({ x: 4, y: 0 });
    expect(edge.ok && vertex.ok).toBe(true);
    if (edge.ok && vertex.ok) {
      expect(edge.output).toEqual({ inside: true, onBoundary: true });
      expect(vertex.output.inside).toBe(true);
    }
  });

  it("rejects points outside a rectangle and inside a concave notch", () => {
    const outside = runPointInPolygon({ x: -1, y: 1 });
    const lShape = { xs: [0, 4, 4, 2, 2, 0], ys: [0, 0, 3, 3, 1, 1] };
    const inArm = runPointInPolygon({ ...lShape, x: 3, y: 2 });
    const inNotch = runPointInPolygon({ ...lShape, x: 1, y: 2 });
    expect(outside.ok && inArm.ok && inNotch.ok).toBe(true);
    if (outside.ok && inArm.ok && inNotch.ok) {
      expect(outside.output).toEqual({ inside: false, onBoundary: false });
      expect(inArm.output.inside).toBe(true);
      expect(inNotch.output.inside).toBe(false);
    }
  });

  it("rejects degenerate polygons", () => {
    expect(runPointInPolygon({ xs: [0, 1], ys: [0, 1] }).ok).toBe(false);
    expect(runPointInPolygon({ xs: [0, 1, 2], ys: [0, 1] }).ok).toBe(false);
  });
});
