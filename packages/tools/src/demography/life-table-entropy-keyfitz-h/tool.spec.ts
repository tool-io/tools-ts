import { describe, expect, it } from "vitest";
import {
  calculateLifeTableEntropyKeyfitzH,
  runLifeTableEntropyKeyfitzH,
  lifeTableEntropyKeyfitzHExample,
} from "./tool.js";

describe("demography/life-table-entropy-keyfitz-h", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLifeTableEntropyKeyfitzH(lifeTableEntropyKeyfitzHExample.input),
    ).toEqual({
      ok: true,
      output: lifeTableEntropyKeyfitzHExample.output,
    });
  });

  it("includes deaths remaining in the terminal age group", () => {
    expect(
      calculateLifeTableEntropyKeyfitzH({ lx: [10, 9], ex: [1, 1] }).entropyH,
    ).toBe(1);
  });

  it("rejects misaligned or non-positive lists", () => {
    expect(runLifeTableEntropyKeyfitzH({ lx: [10], ex: [1] }).ok).toBe(false);
    expect(runLifeTableEntropyKeyfitzH({ lx: [10, 9], ex: [1] }).ok).toBe(
      false,
    );
    expect(runLifeTableEntropyKeyfitzH({ lx: [10, 0], ex: [1, 1] }).ok).toBe(
      false,
    );
    expect(runLifeTableEntropyKeyfitzH({ lx: [9, 10], ex: [1, 1] }).ok).toBe(
      false,
    );
  });
});
