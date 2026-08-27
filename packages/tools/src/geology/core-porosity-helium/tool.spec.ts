import { describe, expect, it } from "vitest";
import { corePorosityHeliumExample, runCorePorosityHelium } from "./tool.js";

describe("core-porosity-helium", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCorePorosityHelium(corePorosityHeliumExample.input)).toEqual({
      ok: true,
      output: corePorosityHeliumExample.output,
    });
  });

  it("rejects grain volume larger than bulk volume", () => {
    expect(
      runCorePorosityHelium({ bulkVolumeCm3: 10, grainVolumeCm3: 11 }).ok,
    ).toBe(false);
  });

  it("rejects non-positive volumes", () => {
    expect(
      runCorePorosityHelium({ bulkVolumeCm3: 0, grainVolumeCm3: 1 }).ok,
    ).toBe(false);
  });
});
