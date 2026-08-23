import { describe, expect, it } from "vitest";
import {
  calculateEtchSelectivity,
  etchSelectivityExample,
  runEtchSelectivity,
} from "./tool.js";

describe("etch selectivity calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEtchSelectivity(etchSelectivityExample.input)).toEqual({
      ok: true,
      output: etchSelectivityExample.output,
    });
  });

  it("maps 150 nm/min over 1 nm/min to exactly 150", () => {
    expect(
      runEtchSelectivity({
        filmEtchRateNmPerMin: 150,
        maskEtchRateNmPerMin: 1,
      }),
    ).toEqual({ ok: true, output: { selectivity: 150 } });
  });

  it("maps 90 nm/min over 0.5 nm/min to exactly 180", () => {
    expect(
      runEtchSelectivity({
        filmEtchRateNmPerMin: 90,
        maskEtchRateNmPerMin: 0.5,
      }),
    ).toEqual({ ok: true, output: { selectivity: 180 } });
  });

  it("maps 200 nm/min over 4 nm/min to exactly 50", () => {
    expect(
      runEtchSelectivity({
        filmEtchRateNmPerMin: 200,
        maskEtchRateNmPerMin: 4,
      }),
    ).toEqual({ ok: true, output: { selectivity: 50 } });
  });

  it("returns one when film and mask etch equally fast", () => {
    expect(
      runEtchSelectivity({
        filmEtchRateNmPerMin: 60,
        maskEtchRateNmPerMin: 60,
      }),
    ).toEqual({ ok: true, output: { selectivity: 1 } });
  });

  it("returns exactly zero for a non-etching film over an etching mask", () => {
    expect(
      runEtchSelectivity({ filmEtchRateNmPerMin: 0, maskEtchRateNmPerMin: 2 }),
    ).toEqual({ ok: true, output: { selectivity: 0 } });
  });

  it("scales linearly with the film rate at fixed mask rate", () => {
    const base = calculateEtchSelectivity({
      filmEtchRateNmPerMin: 30,
      maskEtchRateNmPerMin: 3,
    }).selectivity;
    const tripled = calculateEtchSelectivity({
      filmEtchRateNmPerMin: 90,
      maskEtchRateNmPerMin: 3,
    }).selectivity;
    expect(tripled).toBe(base * 3);
  });

  it("inverts the ratio when the mask rate doubles", () => {
    const base = calculateEtchSelectivity({
      filmEtchRateNmPerMin: 80,
      maskEtchRateNmPerMin: 2,
    }).selectivity;
    const doubled = calculateEtchSelectivity({
      filmEtchRateNmPerMin: 80,
      maskEtchRateNmPerMin: 4,
    }).selectivity;
    expect(doubled).toBeCloseTo(base / 2, 12);
  });

  it("rejects a negative film etch rate while accepting zero", () => {
    const result = runEtchSelectivity({
      filmEtchRateNmPerMin: -1,
      maskEtchRateNmPerMin: 2,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.code).toBe("invalid_input");
    expect(["invalid_field", "invalid_film_rate"]).toContain(
      result.error.issues[0].code,
    );
    expect(result.error.issues[0].field).toBe("filmEtchRateNmPerMin");
    expect(
      runEtchSelectivity({ filmEtchRateNmPerMin: 0, maskEtchRateNmPerMin: 2 })
        .ok,
    ).toBe(true);
    // direct
    let e: unknown = null;
    try {
      calculateEtchSelectivity({
        filmEtchRateNmPerMin: -1,
        maskEtchRateNmPerMin: 2,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_film_rate");
  });

  it("rejects zero and negative mask etch rates via schema", () => {
    for (const bad of [0, -0.5]) {
      const r = runEtchSelectivity({
        filmEtchRateNmPerMin: 150,
        maskEtchRateNmPerMin: bad,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_mask_rate"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("maskEtchRateNmPerMin");
    }
    let e: unknown = null;
    try {
      calculateEtchSelectivity({
        filmEtchRateNmPerMin: 150,
        maskEtchRateNmPerMin: 0,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_mask_rate");
  });

  it("rejects missing, non-numeric, and non-finite inputs", () => {
    const missing = runEtchSelectivity({});
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("expected failure");
    expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runEtchSelectivity({
        filmEtchRateNmPerMin: "fast",
        maskEtchRateNmPerMin: 2,
      }).ok,
    ).toBe(false);
    expect(
      runEtchSelectivity({
        filmEtchRateNmPerMin: Number.NaN,
        maskEtchRateNmPerMin: 2,
      }).ok,
    ).toBe(false);
    expect(
      runEtchSelectivity({
        filmEtchRateNmPerMin: 150,
        maskEtchRateNmPerMin: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and non-object input", () => {
    const unknown = runEtchSelectivity({
      filmEtchRateNmPerMin: 150,
      maskEtchRateNmPerMin: 1,
      chemistry: "CF4",
    });
    expect(unknown.ok).toBe(false);
    if (unknown.ok) throw new Error("expected failure");
    expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runEtchSelectivity(150);
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) throw new Error("expected failure");
    expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("direct calculator handles finite and overflow", () => {
    expect(
      calculateEtchSelectivity({
        filmEtchRateNmPerMin: 0,
        maskEtchRateNmPerMin: 1,
      }).selectivity,
    ).toBe(0);
    expect(() =>
      calculateEtchSelectivity({
        filmEtchRateNmPerMin: -1,
        maskEtchRateNmPerMin: 1,
      }),
    ).toThrow();
    expect(() =>
      calculateEtchSelectivity({
        filmEtchRateNmPerMin: 150,
        maskEtchRateNmPerMin: 0,
      }),
    ).toThrow();
    expect(() =>
      calculateEtchSelectivity({
        filmEtchRateNmPerMin: Number.MAX_VALUE,
        maskEtchRateNmPerMin: Number.MIN_VALUE,
      }),
    ).toThrow();
  });
});
