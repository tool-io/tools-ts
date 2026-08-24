import { describe, expect, it } from "vitest";
import { centroidExample, calculateCentroid, runCentroid } from "./tool.js";

describe("geojson/centroid", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCentroid(centroidExample.input)).toEqual({
      ok: true,
      output: centroidExample.output,
    });
  });
  it("rejects invalid input (not_found)", () => {
    expect(
      runCentroid({ geojson: { type: "FeatureCollection", features: [] } }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(runCentroid({ geojson: 42 }).ok).toBe(false);
  });
});
