import { describe, expect, it } from "vitest";
import { runRemainingRunway } from "./tool.js";

describe("remaining runway calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRemainingRunway({ runwayLengthFt: 5000, usedFt: 1800 })).toEqual({
      ok: true,
      output: { remainingFt: 3200 },
    });
  });
  it("rejects used distance exceeding runway length through execution", () => {
    expect(runRemainingRunway({ runwayLengthFt: 3000, usedFt: 4000 }).ok).toBe(
      false,
    );
  });
});
