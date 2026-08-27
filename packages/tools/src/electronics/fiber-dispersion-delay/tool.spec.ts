import { describe, expect, it } from "vitest";
import {
  calculateFiberDispersionDelay,
  fiberDispersionDelayExample,
  runFiberDispersionDelay,
} from "./tool.js";

describe("Dispersion Delay", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFiberDispersionDelay(fiberDispersionDelayExample.input)).toEqual({
      ok: true,
      output: fiberDispersionDelayExample.output,
    });
  });

  it("reports zero spread for zero dispersion", () => {
    expect(
      runFiberDispersionDelay({
        dispersionPsNmkM: 0,
        lengthKm: 10,
        linewidthNm: 1,
      }),
    ).toEqual({ ok: true, output: { pulseSpreadNs: 0 } });
  });

  it("matches a textbook 1550 nm SMF case", () => {
    expect(
      calculateFiberDispersionDelay({
        dispersionPsNmkM: 17,
        lengthKm: 100,
        linewidthNm: 1,
      }).pulseSpreadNs,
    ).toBe(1.7);
  });

  it("scales linearly with fiber length", () => {
    const short = calculateFiberDispersionDelay({
      dispersionPsNmkM: 4,
      lengthKm: 25,
      linewidthNm: 2,
    }).pulseSpreadNs;
    const long = calculateFiberDispersionDelay({
      dispersionPsNmkM: 4,
      lengthKm: 75,
      linewidthNm: 2,
    }).pulseSpreadNs;
    expect(long).toBeCloseTo(short * 3, 12);
  });

  it("rejects negative dispersion via invalid_dispersion", () => {
    expect(
      runFiberDispersionDelay({
        dispersionPsNmkM: -1,
        lengthKm: 10,
        linewidthNm: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_dispersion", field: "dispersionPsNmkM" }],
      },
      ok: false,
    });
  });

  it("rejects zero length via invalid_length", () => {
    expect(
      runFiberDispersionDelay({
        dispersionPsNmkM: 17,
        lengthKm: 0,
        linewidthNm: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_length", field: "lengthKm" }] },
      ok: false,
    });
  });

  it("rejects zero linewidth via invalid_linewidth", () => {
    expect(
      runFiberDispersionDelay({
        dispersionPsNmkM: 17,
        lengthKm: 10,
        linewidthNm: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_linewidth", field: "linewidthNm" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(
      runFiberDispersionDelay({ lengthKm: 10, linewidthNm: 1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "dispersionPsNmkM" }],
      },
      ok: false,
    });
  });
});
