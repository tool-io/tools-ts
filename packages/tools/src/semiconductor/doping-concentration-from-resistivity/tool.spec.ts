import { describe, expect, it } from "vitest";
import {
  calculateDopingFromResistivity,
  dopingFromResistivityExample,
  runDopingFromResistivity,
} from "./tool.js";
import type { DopingFromResistivityOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDopingFromResistivity>,
): DopingFromResistivityOutput => {
  if (!result.ok) throw new Error("Expected success");
  return result.output as DopingFromResistivityOutput;
};

describe("doping concentration from resistivity calculator", () => {
  it("reproduces its canonical n-type example exactly", () => {
    expect(
      runDopingFromResistivity(dopingFromResistivityExample.input),
    ).toEqual({
      ok: true,
      output: dopingFromResistivityExample.output,
    });
    expect(
      calculateDopingFromResistivity(dopingFromResistivityExample.input)
        .dopingPerCm3,
    ).toBe(10002717578398080);
  });

  it("recovers a known n-type doping from resistivity", () => {
    const result = runDopingFromResistivity({
      carrierType: "n",
      resistivityOhmCm: 0.0564,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dopingPerCm3).toBeGreaterThan(5e16);
    expect(result.output.dopingPerCm3).toBeLessThan(2e17);
    const direct = calculateDopingFromResistivity({
      carrierType: "n",
      resistivityOhmCm: 0.0564,
    }).dopingPerCm3;
    expect(direct).toBeCloseTo(
      (result.output as { dopingPerCm3: number }).dopingPerCm3,
      6,
    );
  });

  it("recovers a known p-type doping via the hole mobility model", () => {
    const result = runDopingFromResistivity({
      carrierType: "p",
      resistivityOhmCm: 1.43,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dopingPerCm3).toBeGreaterThan(5e15);
    expect(result.output.dopingPerCm3).toBeLessThan(2e16);
  });

  it("rejects missing required inputs", () => {
    expect(runDopingFromResistivity({} as never).ok).toBe(false);
    expect(runDopingFromResistivity({ carrierType: "n" } as never).ok).toBe(
      false,
    );
    expect(
      runDopingFromResistivity({ resistivityOhmCm: 0.5 } as never).ok,
    ).toBe(false);
    if (!runDopingFromResistivity({} as never).ok)
      expect(runDopingFromResistivity({} as never).error.issues[0].code).toBe(
        "invalid_field",
      );
  });

  it("rejects wrong type inputs", () => {
    expect(
      runDopingFromResistivity({
        carrierType: "n" as never,
        resistivityOhmCm: "0.5" as never,
      }).ok,
    ).toBe(false);
    expect(
      runDopingFromResistivity({
        carrierType: 42 as never,
        resistivityOhmCm: 0.5,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDopingFromResistivity({
        carrierType: "n",
        resistivityOhmCm: "0.5" as unknown as number,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown fields", () => {
    const unk = runDopingFromResistivity({
      carrierType: "n",
      resistivityOhmCm: 0.5,
      extra: 1,
    } as never);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runDopingFromResistivity(null as never).ok).toBe(false);
    if (!runDopingFromResistivity(null as never).ok)
      expect(runDopingFromResistivity(null as never).error.issues[0].code).toBe(
        "object_required",
      );
    expect(runDopingFromResistivity([] as never).ok).toBe(false);
    expect(runDopingFromResistivity("n" as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDopingFromResistivity({ carrierType: "n", resistivityOhmCm: bad })
          .ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDopingFromResistivity>[0];
      field: string;
    }> = [
      {
        input: { carrierType: "n", resistivityOhmCm: Number.NaN },
        field: "resistivityOhmCm",
      },
      {
        input: { carrierType: "p", resistivityOhmCm: Number.POSITIVE_INFINITY },
        field: "resistivityOhmCm",
      },
      {
        input: { carrierType: "n", resistivityOhmCm: Number.NEGATIVE_INFINITY },
        field: "resistivityOhmCm",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDopingFromResistivity(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    // runner also rejects Infinity via invalid_field schema
    expect(
      runDopingFromResistivity({
        carrierType: "n",
        resistivityOhmCm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects boundaries: non-positive resistivity and invalid carrier type", () => {
    expect(
      runDopingFromResistivity({ carrierType: "n", resistivityOhmCm: 0 }).ok,
    ).toBe(false);
    expect(
      runDopingFromResistivity({ carrierType: "n", resistivityOhmCm: -1 }).ok,
    ).toBe(false);
    expect(
      runDopingFromResistivity({
        carrierType: "x" as never,
        resistivityOhmCm: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runDopingFromResistivity({
        carrierType: "" as never,
        resistivityOhmCm: 0.5,
      }).ok,
    ).toBe(false);

    let err: unknown = null;
    try {
      calculateDopingFromResistivity({ carrierType: "n", resistivityOhmCm: 0 });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("resistivityOhmCm");
    expect((err as { code: string }).code).toBe("invalid_resistivity");
    err = null;
    try {
      calculateDopingFromResistivity({
        carrierType: "x" as "n",
        resistivityOhmCm: 0.5,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("carrierType");
    expect((err as { code: string }).code).toBe("invalid_carrier_type");
  });

  it("direct calculator mirrors runner for valid and invalid", () => {
    expect(
      calculateDopingFromResistivity(dopingFromResistivityExample.input)
        .dopingPerCm3,
    ).toBe(10002717578398080);
    expect(() =>
      calculateDopingFromResistivity({
        carrierType: "n",
        resistivityOhmCm: 0,
      }),
    ).toThrow();
    expect(() =>
      calculateDopingFromResistivity({
        carrierType: "n",
        resistivityOhmCm: Number.NaN,
      }),
    ).toThrow();
    const viaRunner = outputOf(
      runDopingFromResistivity(dopingFromResistivityExample.input),
    ).dopingPerCm3;
    const direct = calculateDopingFromResistivity(
      dopingFromResistivityExample.input,
    ).dopingPerCm3;
    expect(viaRunner).toBe(direct);
  });

  it("preserves properties: monotonic inverse, reciprocal consistency, and inverse approximation", () => {
    const lowRho = calculateDopingFromResistivity({
      carrierType: "n",
      resistivityOhmCm: 0.05,
    }).dopingPerCm3;
    const highRho = calculateDopingFromResistivity({
      carrierType: "n",
      resistivityOhmCm: 5,
    }).dopingPerCm3;
    expect(lowRho).toBeGreaterThan(highRho);

    // monotonic p-type as well
    const lowPho = calculateDopingFromResistivity({
      carrierType: "p",
      resistivityOhmCm: 0.1,
    }).dopingPerCm3;
    const highPho = calculateDopingFromResistivity({
      carrierType: "p",
      resistivityOhmCm: 10,
    }).dopingPerCm3;
    expect(lowPho).toBeGreaterThan(highPho);

    // inverse consistency: compute resistivity from doping and back
    // For n-type 1e17 cm^-3, rho≈0.0779, doping recovered should be near 1e17
    const mid = calculateDopingFromResistivity({
      carrierType: "n",
      resistivityOhmCm: 0.07788968897255023,
    }).dopingPerCm3;
    expect(mid).toBeGreaterThan(5e16);
    expect(mid).toBeLessThan(2e17);
  });

  it("handles extremes without -0 and preserves full precision", () => {
    expect(() =>
      calculateDopingFromResistivity({
        carrierType: "n",
        resistivityOhmCm: Number.MIN_VALUE,
      }),
    ).toThrow();

    const hugeRho = calculateDopingFromResistivity({
      carrierType: "n",
      resistivityOhmCm: 4000,
    });
    expect(Number.isFinite(hugeRho.dopingPerCm3)).toBe(true);
    expect(hugeRho.dopingPerCm3).toBeGreaterThan(0);

    const direct = calculateDopingFromResistivity(
      dopingFromResistivityExample.input,
    ).dopingPerCm3;
    expect(direct).toBe(10002717578398080);
    // not truncated integer vs float distinction not meaningful here, but ensure not -0
    expect(Object.is(direct, -0)).toBe(false);
  });
});
