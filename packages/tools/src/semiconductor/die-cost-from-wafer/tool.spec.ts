import { describe, expect, it } from "vitest";
import {
  calculateDieCostFromWafer,
  dieCostFromWaferExample,
  runDieCostFromWafer,
} from "./tool.js";
import type { DieCostFromWaferOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDieCostFromWafer>,
): DieCostFromWaferOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as DieCostFromWaferOutput;
};

describe("Die Cost From Wafer Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runDieCostFromWafer(dieCostFromWaferExample.input)).toEqual({
      ok: true,
      output: dieCostFromWaferExample.output,
    }));

  it("scales linearly with wafer cost via runner and direct", () => {
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        waferCostEur: 10000,
      }),
    ).toEqual({
      ok: true,
      output: { costPerGoodDieEur: 18.436578171091448 },
    });
    expect(
      calculateDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        waferCostEur: 10000,
      }).costPerGoodDieEur,
    ).toBe(18.436578171091448);
  });

  it("splits the cost across more gross dies", () =>
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        grossDies: 1356,
      }),
    ).toMatchObject({
      ok: true,
      output: { costPerGoodDieEur: 4.609144542772862 },
    }));

  it("accepts a single die at full yield", () =>
    expect(
      runDieCostFromWafer({
        dieYieldPercent: 100,
        grossDies: 1,
        waferCostEur: 250,
      }),
    ).toEqual({ ok: true, output: { costPerGoodDieEur: 250 } }));

  it("accepts the lowest yield boundary", () =>
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        dieYieldPercent: 1,
      }),
    ).toMatchObject({ ok: true }));

  it("rejects missing required inputs", () => {
    expect(runDieCostFromWafer({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runDieCostFromWafer({
        dieYieldPercent: 80,
        grossDies: 678,
      } as never).ok,
    ).toBe(false);
  });

  it("rejects wrong type inputs", () => {
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        waferCostEur: "5000" as never,
      }).ok,
    ).toBe(false);
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        grossDies: "678" as never,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDieCostFromWafer({
        dieYieldPercent: 80,
        grossDies: "678" as unknown as number,
        waferCostEur: 5000,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown input fields", () =>
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        extra: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));

  it("rejects non-object input", () => {
    const nonObject = runDieCostFromWafer(null as never);
    expect(nonObject.ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
    expect(runDieCostFromWafer([] as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDieCostFromWafer({
          ...dieCostFromWaferExample.input,
          waferCostEur: bad,
        }).ok,
      ).toBe(false);
      expect(
        runDieCostFromWafer({
          ...dieCostFromWaferExample.input,
          grossDies: bad,
        }).ok,
      ).toBe(false);
      expect(
        runDieCostFromWafer({
          ...dieCostFromWaferExample.input,
          dieYieldPercent: bad,
        }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDieCostFromWafer>[0];
      field: string;
    }> = [
      {
        input: {
          dieYieldPercent: 80,
          grossDies: 678,
          waferCostEur: Number.NaN,
        },
        field: "waferCostEur",
      },
      {
        input: {
          dieYieldPercent: 80,
          grossDies: Number.POSITIVE_INFINITY,
          waferCostEur: 5000,
        },
        field: "grossDies",
      },
      {
        input: {
          dieYieldPercent: Number.NaN,
          grossDies: 678,
          waferCostEur: 5000,
        },
        field: "dieYieldPercent",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDieCostFromWafer(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: zero gross dies, non-integer gross dies, zero yield, non-positive wafer cost", () => {
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        grossDies: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ field: "grossDies" }] },
      ok: false,
    });
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        grossDies: 678.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "grossDies" }] },
      ok: false,
    });
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        dieYieldPercent: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ field: "dieYieldPercent" }] },
      ok: false,
    });
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        dieYieldPercent: 101,
      }).ok,
    ).toBe(false);
    const zeroCost = runDieCostFromWafer({
      ...dieCostFromWaferExample.input,
      waferCostEur: 0,
    });
    expect(zeroCost.ok).toBe(false);
    if (!zeroCost.ok)
      expect(["invalid_field", "invalid_wafer_cost"]).toContain(
        zeroCost.error.issues[0].code,
      );
    expect(
      runDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        waferCostEur: -100,
      }).ok,
    ).toBe(false);

    let err: unknown = null;
    try {
      calculateDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        grossDies: 0,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("grossDies");
    err = null;
    try {
      calculateDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        waferCostEur: 0,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_wafer_cost");
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateDieCostFromWafer(dieCostFromWaferExample.input)
        .costPerGoodDieEur,
    ).toBe(9.218289085545724);
    expect(
      calculateDieCostFromWafer({
        dieYieldPercent: 100,
        grossDies: 1,
        waferCostEur: 250,
      }).costPerGoodDieEur,
    ).toBe(250);
    expect(() =>
      calculateDieCostFromWafer({
        ...dieCostFromWaferExample.input,
        waferCostEur: 0,
      }),
    ).toThrow();
    expect(() =>
      calculateDieCostFromWafer({
        dieYieldPercent: 80,
        grossDies: 678,
        waferCostEur: Number.NaN,
      }),
    ).toThrow();
  });

  it("scales predictably and is monotonic", () => {
    const base = calculateDieCostFromWafer(
      dieCostFromWaferExample.input,
    ).costPerGoodDieEur;
    const doubleCost = calculateDieCostFromWafer({
      ...dieCostFromWaferExample.input,
      waferCostEur: 10000,
    }).costPerGoodDieEur;
    expect(doubleCost).toBeCloseTo(base * 2, 12);

    const doubleDies = calculateDieCostFromWafer({
      ...dieCostFromWaferExample.input,
      grossDies: 1356,
    }).costPerGoodDieEur;
    expect(doubleDies).toBeCloseTo(base / 2, 12);

    const lowYield = calculateDieCostFromWafer({
      ...dieCostFromWaferExample.input,
      dieYieldPercent: 0.5,
    }).costPerGoodDieEur;
    const highYield = calculateDieCostFromWafer({
      ...dieCostFromWaferExample.input,
      dieYieldPercent: 100,
    }).costPerGoodDieEur;
    expect(lowYield).toBeGreaterThan(highYield);
  });

  it("preserves inverse: waferCost = costPerGood * N_gross * Y/100", () => {
    const input = dieCostFromWaferExample.input;
    const cost = calculateDieCostFromWafer(input).costPerGoodDieEur;
    const recoveredWaferCost =
      cost * ((input.grossDies * input.dieYieldPercent) / 100);
    expect(recoveredWaferCost).toBeCloseTo(input.waferCostEur, 9);
    const viaRunner = outputOf(runDieCostFromWafer(input)).costPerGoodDieEur;
    expect(viaRunner).toBe(cost);
  });

  it("handles extremes without -0 and preserves full precision", () => {
    const tiny = calculateDieCostFromWafer({
      dieYieldPercent: 100,
      grossDies: Number.MAX_SAFE_INTEGER,
      waferCostEur: 1,
    });
    expect(Number.isFinite(tiny.costPerGoodDieEur)).toBe(true);
    expect(Object.is(tiny.costPerGoodDieEur, -0)).toBe(false);

    const direct = calculateDieCostFromWafer(
      dieCostFromWaferExample.input,
    ).costPerGoodDieEur;
    const viaRunner = outputOf(
      runDieCostFromWafer(dieCostFromWaferExample.input),
    ).costPerGoodDieEur;
    expect(direct).toBe(viaRunner);
    expect(direct).toBe(9.218289085545724);
    expect(direct.toString()).not.toBe("9.218");
  });
});
