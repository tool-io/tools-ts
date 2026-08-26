import { describe, expect, it } from "vitest";
import {
  runVeneerPressPressure,
  veneerPressPressureExample,
  veneerPressPressureTool,
} from "./tool.js";

describe("Veneer Press Pressure Calculator", () => {
  it("computes the canonical example", () =>
    expect(runVeneerPressPressure(veneerPressPressureExample.input)).toEqual({
      ok: true,
      output: { pressureBar: 0.4 },
    }));

  it.each([
    [20000, 0.5, 0.4],
    [15000, 1, 0.15],
    [6000, 0.3, 0.2],
    [100000, 0.01, 100],
  ])("converts %p N over %p m² to bar", (forceNewtons, areaM2, expected) =>
    expect(runVeneerPressPressure({ areaM2, forceNewtons })).toEqual({
      ok: true,
      output: { pressureBar: expected },
    }),
  );

  it("halves the pressure when the area doubles", () => {
    const small = runVeneerPressPressure({ areaM2: 0.25, forceNewtons: 10000 });
    const large = runVeneerPressPressure({ areaM2: 0.5, forceNewtons: 10000 });
    expect(small.ok && large.ok).toBe(true);
    if (small.ok && large.ok)
      expect((small.output as { pressureBar: number }).pressureBar).toBe(
        2 * (large.output as { pressureBar: number }).pressureBar,
      );
  });

  it("rejects a zero force with a stable error", () =>
    expect(runVeneerPressPressure({ areaM2: 0.25, forceNewtons: 0 })).toEqual({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "must_be_positive",
            field: "forceNewtons",
            message: "Force must be positive.",
          },
        ],
      },
    }));

  it("rejects non-positive areas", () => {
    const zero = runVeneerPressPressure({ areaM2: 0, forceNewtons: 10000 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "areaM2",
        message: "Area must be positive.",
      });
    expect(runVeneerPressPressure({ areaM2: -1, forceNewtons: 10000 }).ok).toBe(
      false,
    );
  });

  it("rejects negative forces", () =>
    expect(
      runVeneerPressPressure({ areaM2: 0.25, forceNewtons: -500 }).ok,
    ).toBe(false));

  it("rejects missing and non-finite inputs", () => {
    expect(runVeneerPressPressure({ areaM2: 0.25 }).ok).toBe(false);
    expect(
      runVeneerPressPressure({
        areaM2: Number.NaN,
        forceNewtons: 10000,
      }).ok,
    ).toBe(false);
    expect(
      runVeneerPressPressure({
        areaM2: 0.25,
        forceNewtons: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric inputs", () =>
    expect(
      runVeneerPressPressure({
        areaM2: "0.25",
        forceNewtons: 10000,
      } as never).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runVeneerPressPressure({
      areaM2: 0.25,
      forceNewtons: 10000,
      platenCount: 2,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(veneerPressPressureExample))).toEqual(
      veneerPressPressureExample,
    );
    expect(veneerPressPressureTool.id).toBe(
      "carpentry/furnierpresse-druck-bar",
    );
    expect(veneerPressPressureTool.execution).toEqual({ kind: "pure" });
  });
});
