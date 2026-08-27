import { describe, expect, it } from "vitest";
import {
  bjtBaseCurrentExample,
  calculateBjtBaseCurrent,
  runBjtBaseCurrent,
} from "./tool.js";

describe("BJT Base Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBjtBaseCurrent(bjtBaseCurrentExample.input)).toEqual({
      ok: true,
      output: bjtBaseCurrentExample.output,
    });
  });

  it("rejects non-positive beta", () => {
    expect(
      runBjtBaseCurrent({ betaHfe: 0, collectorCurrentA: 0.01 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_beta" }] },
      ok: false,
    });
  });

  it("halves base current when beta doubles", () => {
    expect(
      calculateBjtBaseCurrent({ betaHfe: 200, collectorCurrentA: 0.01 })
        .baseCurrentA,
    ).toBe(bjtBaseCurrentExample.output.baseCurrentA / 2);
  });
});
