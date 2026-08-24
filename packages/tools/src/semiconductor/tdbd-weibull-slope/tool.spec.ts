import { describe, expect, it } from "vitest";
import { runTdbdWeibullSlope, tdbdWeibullSlopeExample } from "./tool.js";

describe("TDDB Weibull Failure Fraction Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runTdbdWeibullSlope(tdbdWeibullSlopeExample.input)).toEqual({
      ok: true,
      output: tdbdWeibullSlopeExample.output,
    }));

  it("returns zero failures at zero stress time", () =>
    expect(
      runTdbdWeibullSlope({
        characteristicLifeSeconds: 1000,
        shapeBeta: 2,
        testTimeSeconds: 0,
      }),
    ).toEqual({ ok: true, output: { failureFraction: 0 } }));

  it("is monotonically increasing in stress time", () => {
    const at = (seconds: number) =>
      runTdbdWeibullSlope({
        characteristicLifeSeconds: 1000,
        shapeBeta: 2,
        testTimeSeconds: seconds,
      }) as { ok: boolean; output?: { failureFraction: number } };
    expect(at(500).output?.failureFraction).toBeLessThan(
      at(1000).output?.failureFraction ?? -1,
    );
    expect(at(1000).output?.failureFraction).toBeLessThan(
      at(2000).output?.failureFraction ?? -1,
    );
  });

  it("matches the exponential limit for unit shape", () =>
    expect(
      runTdbdWeibullSlope({
        characteristicLifeSeconds: 1000,
        shapeBeta: 1,
        testTimeSeconds: 500,
      }),
    ).toEqual({ ok: true, output: { failureFraction: 0.3934693402873666 } }));

  it("approaches certainty far beyond the characteristic life", () =>
    expect(
      runTdbdWeibullSlope({
        characteristicLifeSeconds: 1000,
        shapeBeta: 2,
        testTimeSeconds: 10000,
      }),
    ).toEqual({ ok: true, output: { failureFraction: 1 } }));

  it("reaches about 63.2 percent at the characteristic life for any beta", () =>
    expect(
      runTdbdWeibullSlope({
        characteristicLifeSeconds: 2500,
        shapeBeta: 4.5,
        testTimeSeconds: 2500,
      }),
    ).toEqual({ ok: true, output: { failureFraction: 0.6321205588285577 } }));

  it("rejects negative stress time", () =>
    expect(
      runTdbdWeibullSlope({
        characteristicLifeSeconds: 1000,
        shapeBeta: 2,
        testTimeSeconds: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "testTimeSeconds" }] },
      ok: false,
    }));

  it("rejects a zero characteristic life", () =>
    expect(
      runTdbdWeibullSlope({
        characteristicLifeSeconds: 0,
        shapeBeta: 2,
        testTimeSeconds: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_value", field: "characteristicLifeSeconds" }],
      },
      ok: false,
    }));

  it("rejects a zero shape beta", () =>
    expect(
      runTdbdWeibullSlope({
        characteristicLifeSeconds: 1000,
        shapeBeta: 0,
        testTimeSeconds: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value", field: "shapeBeta" }] },
      ok: false,
    }));

  it("rejects non-finite inputs", () =>
    expect(
      runTdbdWeibullSlope({
        characteristicLifeSeconds: Number.POSITIVE_INFINITY,
        shapeBeta: 2,
        testTimeSeconds: 100,
      }).ok,
    ).toBe(false));

  it("rejects missing required inputs", () =>
    expect(
      runTdbdWeibullSlope({ shapeBeta: 2, testTimeSeconds: 100 } as never),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "characteristicLifeSeconds" }],
      },
      ok: false,
    }));
});
