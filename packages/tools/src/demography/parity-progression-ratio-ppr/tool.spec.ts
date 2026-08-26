import { describe, expect, it } from "vitest";
import {
  calculateParityProgressionRatioPpr,
  runParityProgressionRatioPpr,
  parityProgressionRatioPprExample,
} from "./tool.js";

describe("demography/parity-progression-ratio-ppr", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runParityProgressionRatioPpr(parityProgressionRatioPprExample.input),
    ).toEqual({
      ok: true,
      output: parityProgressionRatioPprExample.output,
    });
  });

  it("stops progression entirely when nobody advances", () => {
    expect(
      calculateParityProgressionRatioPpr({ womenByParity: [50, 50, 0] })
        .progressionRatios,
    ).toEqual([0.5, 0]);
  });

  it("rejects empty schedules and non-positive totals", () => {
    expect(runParityProgressionRatioPpr({ womenByParity: [0] }).ok).toBe(false);
    expect(runParityProgressionRatioPpr({ womenByParity: [0, 0] }).ok).toBe(
      false,
    );
  });
});
