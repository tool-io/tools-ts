import { describe, expect, it } from "vitest";
import {
  potentialSupportRatioPsrExample,
  runPotentialSupportRatioPsr,
} from "./tool.js";

describe("potential-support-ratio-psr", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPotentialSupportRatioPsr(potentialSupportRatioPsrExample.input),
    ).toEqual({
      ok: true,
      output: potentialSupportRatioPsrExample.output,
    });
  });

  it("scales linearly with both inputs", () => {
    const r = runPotentialSupportRatioPsr({
      workingAgePopulation15To64: 300,
      elderlyPopulation65Plus: 100,
    });
    expect(r.ok && r.output.potentialSupportRatio).toBe(3);
  });

  it("rejects a zero elderly population", () => {
    expect(
      runPotentialSupportRatioPsr({
        workingAgePopulation15To64: 10,
        elderlyPopulation65Plus: 0,
      }).ok,
    ).toBe(false);
  });
});
