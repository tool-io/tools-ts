import { describe, expect, it } from "vitest";
import {
  mineralDensityLookupExample,
  runMineralDensityLookup,
} from "./tool.js";

describe("mineral-density-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMineralDensityLookup(mineralDensityLookupExample.input)).toEqual({
      ok: true,
      output: mineralDensityLookupExample.output,
    });
  });

  it("gives galena its classic high density", () => {
    const result = runMineralDensityLookup({ mineral: "galena" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.densityGPerCm3 as number).toBe(7.5);
  });
  it("rejects unknown minerals", () => {
    expect(runMineralDensityLookup({ mineral: "unobtainium" }).ok).toBe(false);
  });
});
