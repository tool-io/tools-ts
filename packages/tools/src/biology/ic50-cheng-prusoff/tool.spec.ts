import { describe, expect, it } from "vitest";
import { runIc50ChengPrusoff } from "./tool.js";

describe("Cheng-Prusoff IC50", () => {
  it("calculates a valid result", () =>
    expect(
      runIc50ChengPrusoff({
        ic50ObservedNanomolar: 25,
        kd: 5,
        ligandConc: 50,
      }),
    ).toEqual({
      ok: true,
      output: { trueKiNanomolar: 2.272727272727273 },
    }));
  it("approaches the observed IC50 when ligand is negligible", () => {
    const result = runIc50ChengPrusoff({
      ic50ObservedNanomolar: 40,
      kd: 10000,
      ligandConc: 0.0001,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.trueKiNanomolar).toBeCloseTo(40, 6);
  });
  it("scales linearly with the apparent Ki", () => {
    const result = runIc50ChengPrusoff({
      ic50ObservedNanomolar: 8,
      kd: 2,
      ligandConc: 6,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.trueKiNanomolar).toBe(2);
  });
  it("halves the IC50 when ligand concentration equals Kd", () => {
    const result = runIc50ChengPrusoff({
      ic50ObservedNanomolar: 15,
      kd: 30,
      ligandConc: 30,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.trueKiNanomolar).toBe(7.5);
  });
  it("rejects zero observed IC50", () => {
    const result = runIc50ChengPrusoff({
      ic50ObservedNanomolar: 0,
      kd: 5,
      ligandConc: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_ic50");
  });
  it("returns IC50 when ligand concentration is zero", () =>
    expect(
      runIc50ChengPrusoff({
        ic50ObservedNanomolar: 25,
        kd: 5,
        ligandConc: 0,
      }),
    ).toEqual({ ok: true, output: { trueKiNanomolar: 25 } }));
  it("rejects non-positive Kd", () => {
    const result = runIc50ChengPrusoff({
      ic50ObservedNanomolar: 25,
      kd: 0,
      ligandConc: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_kd");
  });
});
