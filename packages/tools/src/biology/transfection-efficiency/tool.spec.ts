import { describe, expect, it } from "vitest";
import { runTransfectionEfficiency } from "./tool.js";

describe("Transfection Efficiency %", () => {
  it("calculates a valid result", () =>
    expect(
      runTransfectionEfficiency({ fluorescentCells: 250, totalCells: 500 }),
    ).toEqual({ ok: true, output: { efficiencyPercent: 50 } }));
  it("reports zero for no fluorescent cells", () =>
    expect(
      runTransfectionEfficiency({ fluorescentCells: 0, totalCells: 400 }),
    ).toEqual({ ok: true, output: { efficiencyPercent: 0 } }));
  it("reports one hundred for fully transfected cultures", () =>
    expect(
      runTransfectionEfficiency({ fluorescentCells: 400, totalCells: 400 }),
    ).toEqual({ ok: true, output: { efficiencyPercent: 100 } }));
  it("supports fractional efficiencies", () =>
    expect(
      runTransfectionEfficiency({ fluorescentCells: 85, totalCells: 340 }),
    ).toEqual({ ok: true, output: { efficiencyPercent: 25 } }));
  it("handles odd counts", () =>
    expect(
      runTransfectionEfficiency({ fluorescentCells: 34, totalCells: 40 }),
    ).toEqual({ ok: true, output: { efficiencyPercent: 85 } }));
  it("rejects fluorescent cells exceeding the total", () => {
    const result = runTransfectionEfficiency({
      fluorescentCells: 501,
      totalCells: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("exceeds_total");
  });
  it("rejects zero total cells", () =>
    expect(
      runTransfectionEfficiency({ fluorescentCells: 10, totalCells: 0 }).ok,
    ).toBe(false));
  it("rejects negative fluorescent cells", () =>
    expect(
      runTransfectionEfficiency({ fluorescentCells: -5, totalCells: 100 }).ok,
    ).toBe(false));
});
