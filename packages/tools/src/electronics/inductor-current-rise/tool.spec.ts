import { describe, expect, it } from "vitest";
import { inductorCurrentRiseExample, runInductorCurrentRise } from "./tool.js";

describe("RL Current Rise", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runInductorCurrentRise(inductorCurrentRiseExample.input)).toEqual({
      ok: true,
      output: inductorCurrentRiseExample.output,
    }));

  it("starts at zero current at time zero", () =>
    expect(
      runInductorCurrentRise({
        inductanceH: 0.1,
        resistanceOhms: 5,
        supplyVolts: 10,
        timeSeconds: 0,
      }),
    ).toEqual({ ok: true, output: { inductorCurrentA: 0 } }));

  it("computes the current after two time constants", () =>
    expect(
      runInductorCurrentRise({
        inductanceH: 0.1,
        resistanceOhms: 5,
        supplyVolts: 10,
        timeSeconds: 0.04,
      }),
    ).toEqual({ ok: true, output: { inductorCurrentA: 1.7293294335267746 } }));

  it("approaches the steady-state current of supply over resistance", () => {
    const result = runInductorCurrentRise({
      inductanceH: 0.1,
      resistanceOhms: 5,
      supplyVolts: 10,
      timeSeconds: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.inductorCurrentA).toBeGreaterThan(1.9999);
  });

  it("rises monotonically with elapsed time", () => {
    const early = runInductorCurrentRise({
      inductanceH: 0.1,
      resistanceOhms: 5,
      supplyVolts: 10,
      timeSeconds: 0.02,
    });
    const late = runInductorCurrentRise({
      inductanceH: 0.1,
      resistanceOhms: 5,
      supplyVolts: 10,
      timeSeconds: 0.04,
    });
    expect(early.ok).toBe(true);
    expect(late.ok).toBe(true);
    if (!early.ok || !late.ok) return;
    expect(late.output.inductorCurrentA).toBeGreaterThan(
      Number(early.output.inductorCurrentA),
    );
  });

  it("rejects zero inductance", () =>
    expect(
      runInductorCurrentRise({
        inductanceH: 0,
        resistanceOhms: 5,
        supplyVolts: 10,
        timeSeconds: 0.02,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "inductanceH" }] },
      ok: false,
    }));

  it("rejects negative time", () =>
    expect(
      runInductorCurrentRise({
        inductanceH: 0.1,
        resistanceOhms: 5,
        supplyVolts: 10,
        timeSeconds: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "timeSeconds" }] },
      ok: false,
    }));

  it("rejects non-finite supply voltage", () =>
    expect(
      runInductorCurrentRise({
        inductanceH: 0.1,
        resistanceOhms: 5,
        supplyVolts: Number.NaN,
        timeSeconds: 0.02,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "supplyVolts" }] },
      ok: false,
    }));
});
