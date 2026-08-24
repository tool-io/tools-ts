import { describe, expect, it } from "vitest";
import {
  calculateTransferLength,
  runTransferLength,
  transferLengthExample,
} from "./tool.js";
import type { TransferLengthOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runTransferLength>,
): TransferLengthOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as TransferLengthOutput;
};

describe("transfer length calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTransferLength(transferLengthExample.input)).toEqual({
      ok: true,
      output: transferLengthExample.output,
    });
  });

  it("maps 1e-6 ohm*cm^2 over 100 ohm/sq to exactly 1 um via runner and direct", () => {
    expect(
      runTransferLength({
        sheetResistanceOhmsPerSquare: 100,
        specificContactResistivityOhmCm2: 1e-6,
      }),
    ).toEqual({ ok: true, output: { transferLengthUm: 1 } });
    expect(
      calculateTransferLength({
        sheetResistanceOhmsPerSquare: 100,
        specificContactResistivityOhmCm2: 1e-6,
      }).transferLengthUm,
    ).toBe(1);
  });

  it("maps 4e-6 ohm*cm^2 over 100 ohm/sq to exactly 2 um", () => {
    expect(
      runTransferLength({
        sheetResistanceOhmsPerSquare: 100,
        specificContactResistivityOhmCm2: 4e-6,
      }),
    ).toEqual({ ok: true, output: { transferLengthUm: 2 } });
    expect(
      calculateTransferLength({
        sheetResistanceOhmsPerSquare: 100,
        specificContactResistivityOhmCm2: 4e-6,
      }).transferLengthUm,
    ).toBe(2);
  });

  it("rejects missing required inputs", () => {
    const missing = runTransferLength({} as never);
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runTransferLength({
        sheetResistanceOhmsPerSquare: 100,
      } as never).ok,
    ).toBe(false);
    expect(
      runTransferLength({
        specificContactResistivityOhmCm2: 1e-6,
      } as never).ok,
    ).toBe(false);
  });

  it("rejects wrong type inputs", () => {
    expect(
      runTransferLength({
        sheetResistanceOhmsPerSquare: "100" as never,
        specificContactResistivityOhmCm2: 1e-6,
      }).ok,
    ).toBe(false);
    expect(
      runTransferLength({
        sheetResistanceOhmsPerSquare: 100,
        specificContactResistivityOhmCm2: "1e-6" as never,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateTransferLength({
        sheetResistanceOhmsPerSquare: "100" as unknown as number,
        specificContactResistivityOhmCm2: 1e-6,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown fields", () => {
    const unknown = runTransferLength({
      sheetResistanceOhmsPerSquare: 100,
      specificContactResistivityOhmCm2: 1e-6,
      extra: 1,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runTransferLength(null as never).ok).toBe(false);
    if (!runTransferLength(null as never).ok)
      expect(runTransferLength(null as never).error.issues[0].code).toBe(
        "object_required",
      );
    expect(runTransferLength([] as never).ok).toBe(false);
    expect(runTransferLength(42 as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runTransferLength({
          sheetResistanceOhmsPerSquare: bad,
          specificContactResistivityOhmCm2: 1e-6,
        }).ok,
      ).toBe(false);
      expect(
        runTransferLength({
          sheetResistanceOhmsPerSquare: 100,
          specificContactResistivityOhmCm2: bad,
        }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateTransferLength>[0];
      field: string;
    }> = [
      {
        input: {
          sheetResistanceOhmsPerSquare: Number.NaN,
          specificContactResistivityOhmCm2: 1e-6,
        },
        field: "sheetResistanceOhmsPerSquare",
      },
      {
        input: {
          sheetResistanceOhmsPerSquare: Number.POSITIVE_INFINITY,
          specificContactResistivityOhmCm2: 1e-6,
        },
        field: "sheetResistanceOhmsPerSquare",
      },
      {
        input: {
          sheetResistanceOhmsPerSquare: 100,
          specificContactResistivityOhmCm2: Number.NaN,
        },
        field: "specificContactResistivityOhmCm2",
      },
      {
        input: {
          sheetResistanceOhmsPerSquare: 100,
          specificContactResistivityOhmCm2: Number.NEGATIVE_INFINITY,
        },
        field: "specificContactResistivityOhmCm2",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateTransferLength(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects zero and negative boundaries through schema and direct", () => {
    const zeroRho = runTransferLength({
      sheetResistanceOhmsPerSquare: 100,
      specificContactResistivityOhmCm2: 0,
    });
    expect(zeroRho.ok).toBe(false);
    if (!zeroRho.ok)
      expect(["invalid_field", "invalid_contact_resistivity"]).toContain(
        zeroRho.error.issues[0].code,
      );
    expect(
      runTransferLength({
        sheetResistanceOhmsPerSquare: 100,
        specificContactResistivityOhmCm2: -1e-6,
      }).ok,
    ).toBe(false);

    const zeroRsh = runTransferLength({
      sheetResistanceOhmsPerSquare: 0,
      specificContactResistivityOhmCm2: 1e-6,
    });
    expect(zeroRsh.ok).toBe(false);
    if (!zeroRsh.ok)
      expect(["invalid_field", "invalid_sheet_resistance"]).toContain(
        zeroRsh.error.issues[0].code,
      );
    expect(
      runTransferLength({
        sheetResistanceOhmsPerSquare: -10,
        specificContactResistivityOhmCm2: 1e-6,
      }).ok,
    ).toBe(false);

    let err: unknown = null;
    try {
      calculateTransferLength({
        sheetResistanceOhmsPerSquare: 0,
        specificContactResistivityOhmCm2: 1e-6,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_sheet_resistance");
    expect((err as { field: string }).field).toBe(
      "sheetResistanceOhmsPerSquare",
    );

    err = null;
    try {
      calculateTransferLength({
        sheetResistanceOhmsPerSquare: 100,
        specificContactResistivityOhmCm2: 0,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_contact_resistivity");
  });

  it("handles direct calculation and field codes", () => {
    expect(
      calculateTransferLength({
        sheetResistanceOhmsPerSquare: 120,
        specificContactResistivityOhmCm2: 1e-5,
      }).transferLengthUm,
    ).toBe(2.886751345948129);
    expect(() =>
      calculateTransferLength({
        sheetResistanceOhmsPerSquare: -10,
        specificContactResistivityOhmCm2: 1e-6,
      }),
    ).toThrow();
  });

  it("satisfies Lt^2 = rho_c / Rsh in squared microns and scales predictably", () => {
    const result = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 120,
      specificContactResistivityOhmCm2: 1e-5,
    });
    expect(result.transferLengthUm ** 2).toBeCloseTo((1e-5 / 120) * 1e8, 9);

    const base = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 100,
      specificContactResistivityOhmCm2: 1e-6,
    }).transferLengthUm;
    const quadrupled = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 100,
      specificContactResistivityOhmCm2: 4e-6,
    }).transferLengthUm;
    expect(quadrupled).toBeCloseTo(base * 2, 12);

    const halved = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 50,
      specificContactResistivityOhmCm2: 1e-7,
    }).transferLengthUm;
    expect(halved).toBe(0.44721359549995787);
  });

  it("is monotonic in rho_c and inversely monotonic in Rsh", () => {
    const lowRho = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 100,
      specificContactResistivityOhmCm2: 1e-6,
    }).transferLengthUm;
    const highRho = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 100,
      specificContactResistivityOhmCm2: 1e-5,
    }).transferLengthUm;
    expect(highRho).toBeGreaterThan(lowRho);

    const lowRsh = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 10,
      specificContactResistivityOhmCm2: 1e-6,
    }).transferLengthUm;
    const highRsh = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 1000,
      specificContactResistivityOhmCm2: 1e-6,
    }).transferLengthUm;
    expect(highRsh).toBeLessThan(lowRsh);
  });

  it("preserves inverse: rho_c = (Lt/1e4)^2 * Rsh", () => {
    const input = {
      sheetResistanceOhmsPerSquare: 100,
      specificContactResistivityOhmCm2: 2.5e-6,
    };
    const out = calculateTransferLength(input).transferLengthUm;
    const recoveredRho = (out / 1e4) ** 2 * input.sheetResistanceOhmsPerSquare;
    expect(recoveredRho).toBeCloseTo(
      input.specificContactResistivityOhmCm2,
      12,
    );

    const viaRunner = outputOf(
      runTransferLength({
        sheetResistanceOhmsPerSquare: 100,
        specificContactResistivityOhmCm2: 1e-6,
      }),
    ).transferLengthUm;
    expect(viaRunner).toBe(1);
  });

  it("handles small positives without -0 and avoids overflow when finite", () => {
    const tiny = runTransferLength({
      sheetResistanceOhmsPerSquare: 1e6,
      specificContactResistivityOhmCm2: 1e-12,
    });
    expect(tiny.ok).toBe(true);
    if (tiny.ok) {
      expect((tiny.output as TransferLengthOutput).transferLengthUm).toBe(
        0.00001,
      );
      expect(
        Object.is((tiny.output as TransferLengthOutput).transferLengthUm, -0),
      ).toBe(false);
    }

    const large = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 1,
      specificContactResistivityOhmCm2: 1e6,
    });
    expect(Number.isFinite(large.transferLengthUm)).toBe(true);
    expect(large.transferLengthUm).toBe(10000000);
    expect(Object.is(large.transferLengthUm, -0)).toBe(false);

    const small = calculateTransferLength({
      sheetResistanceOhmsPerSquare: 1e6,
      specificContactResistivityOhmCm2: 1e-12,
    });
    expect(small.transferLengthUm).toBeGreaterThan(0);
  });

  it("runner and direct agree and preserve full precision", () => {
    const input = {
      sheetResistanceOhmsPerSquare: 120,
      specificContactResistivityOhmCm2: 1e-5,
    };
    const direct = calculateTransferLength(input).transferLengthUm;
    const viaRunner = outputOf(runTransferLength(input)).transferLengthUm;
    expect(direct).toBe(viaRunner);
    expect(direct).toBe(2.886751345948129);
    // full precision: not rounded to e.g. 2.887
    expect(direct.toString()).not.toBe("2.887");
  });
});
