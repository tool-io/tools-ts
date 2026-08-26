import { describe, expect, it } from "vitest";
import { runLactationCurveWood } from "./tool.js";

describe("Wood Lactation Curve", () => {
  it("predicts yield at day one hundred with default coefficients", () =>
    expect(runLactationCurveWood({ daysInMilk: 100 })).toEqual({
      ok: true,
      output: { predictedDailyMilkKg: 61.5696079507086 },
    }));
  it("predicts peak-adjacent yield on day one", () =>
    expect(runLactationCurveWood({ daysInMilk: 1 })).toEqual({
      ok: true,
      output: { predictedDailyMilkKg: 24.937578059936502 },
    }));
  it("applies custom coefficients", () =>
    expect(
      runLactationCurveWood({
        aConstant: 20,
        bCoefficient: 0.5,
        cCoefficient: 0.004,
        daysInMilk: 50,
      }),
    ).toEqual({
      ok: true,
      output: { predictedDailyMilkKg: 115.78601349348196 },
    }));
  it("grows yield toward mid lactation before decay", () => {
    const early = runLactationCurveWood({ daysInMilk: 10 });
    const peak = runLactationCurveWood({ daysInMilk: 100 });
    const late = runLactationCurveWood({ daysInMilk: 400 });
    expect(early.ok && peak.ok && late.ok).toBe(true);
    if (early.ok && peak.ok && late.ok)
      expect(
        Number(late.output.predictedDailyMilkKg) <
          Number(peak.output.predictedDailyMilkKg),
      ).toBe(true);
  });
  it("rejects zero days in milk", () =>
    expect(runLactationCurveWood({ daysInMilk: 0 }).ok).toBe(false));
  it("rejects non-positive scale constant", () =>
    expect(runLactationCurveWood({ aConstant: 0, daysInMilk: 10 }).ok).toBe(
      false,
    ));
  it("rejects non-positive decay coefficient", () =>
    expect(
      runLactationCurveWood({ cCoefficient: -0.001, daysInMilk: 10 }).ok,
    ).toBe(false));
  it("rejects ramp coefficient above one", () =>
    expect(
      runLactationCurveWood({ bCoefficient: 1.5, daysInMilk: 10 }).ok,
    ).toBe(false));
});
