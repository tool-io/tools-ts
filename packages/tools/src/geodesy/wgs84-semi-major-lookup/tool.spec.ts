import { describe, expect, it } from "vitest";
import {
  wgs84SemiMajorLookupExample,
  runWgs84SemiMajorLookup,
} from "./tool.js";

describe("geodesy/wgs84-semi-major-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWgs84SemiMajorLookup(wgs84SemiMajorLookupExample.input)).toEqual({
      ok: true,
      output: wgs84SemiMajorLookupExample.output,
    });
  });

  it("returns the same defining value for any realisation", () => {
    const r = runWgs84SemiMajorLookup({ model: "wgs84-refined" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.semiMajorAxisMeters).toBe(6378137);
  });
});
