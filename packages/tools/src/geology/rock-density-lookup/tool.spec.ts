import { describe, expect, it } from "vitest";
import { rockDensityLookupExample, runRockDensityLookup } from "./tool.js";

describe("rock-density-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRockDensityLookup(rockDensityLookupExample.input)).toEqual({
      ok: true,
      output: rockDensityLookupExample.output,
    });
  });

  it("puts granite near 2.7 g/cm3", () => {
    const result = runRockDensityLookup({ rock: "granite" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.typicalDensityMidGPerCm3 as number).toBe(2.7);
  });
  it("rejects unknown rocks", () => {
    expect(runRockDensityLookup({ rock: "cheese" }).ok).toBe(false);
  });
});
