import { describe, expect, it } from "vitest";
import {
  calculateCurrentDivider,
  currentDividerExample,
  runCurrentDivider,
} from "./tool.js";

describe("current divider calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCurrentDivider(currentDividerExample.input)).toEqual({
      ok: true,
      output: currentDividerExample.output,
    });
  });

  it("gives the lower-resistance branch more current", () => {
    const low = calculateCurrentDivider({
      branchResistanceOhms: 50,
      otherResistanceOhms: 150,
      totalCurrentA: 4,
    }).branchCurrentA;
    const high = calculateCurrentDivider({
      branchResistanceOhms: 150,
      otherResistanceOhms: 50,
      totalCurrentA: 4,
    }).branchCurrentA;
    expect(low + high).toBe(4);
    expect(low).toBeGreaterThan(high);
    expect(
      calculateCurrentDivider({
        branchResistanceOhms: 100,
        otherResistanceOhms: 100,
        totalCurrentA: 4,
      }).branchCurrentA,
    ).toBe(2);
  });

  it("rejects non-positive resistances through execution", () => {
    for (const bad of [
      { branchResistanceOhms: 0, otherResistanceOhms: 300, totalCurrentA: 3 },
      {
        branchResistanceOhms: 100,
        otherResistanceOhms: -300,
        totalCurrentA: 3,
      },
    ])
      expect(runCurrentDivider(bad).ok).toBe(false);
  });
});
