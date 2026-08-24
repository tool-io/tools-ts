import { describe, expect, it } from "vitest";
import {
  boundingBoxExample,
  calculateBoundingBox,
  runBoundingBox,
} from "./tool.js";

describe("geojson/bounding-box", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBoundingBox(boundingBoxExample.input)).toEqual({
      ok: true,
      output: boundingBoxExample.output,
    });
  });
  it("rejects invalid input (not_found)", () => {
    expect(runBoundingBox({ geojson: { type: "Point" } }).ok).toBe(false);
  });
  it("rejects invalid input (unsupported_type)", () => {
    expect(
      runBoundingBox({ geojson: { type: "Cube", coordinates: [1, 2] } }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(runBoundingBox({ geojson: "nope" }).ok).toBe(false);
  });
});
