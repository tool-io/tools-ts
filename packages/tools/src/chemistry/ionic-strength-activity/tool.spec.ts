import { describe, expect, it } from "vitest";
import { runIonicStrengthActivity } from "./tool.js";
describe("Ionic Strength Activity Calculator", () => {
  it("NaCl gives I=0.1", () => {
    expect(
      runIonicStrengthActivity({
        charge1: 1,
        charge2: 1,
        conc1MolL: 0.1,
        conc2MolL: 0.1,
      }),
    ).toEqual({ ok: true, output: { ionicStrengthMolL: 0.1 } });
  });
  it("rejects invalid input", () =>
    expect(runIonicStrengthActivity(null).ok).toBe(false));
});
