import { describe, expect, it } from "vitest";
import { halyardTensionJibExample, runHalyardTensionJib } from "./tool.js";

describe("Jib Halyard Tension Guide", () => {
  it("calculates the canonical example exactly", () => {
    expect(runHalyardTensionJib(halyardTensionJibExample.input)).toEqual({
      ok: true,
      output: { halyardTensionNewtons: 1176.798 },
    });
  });

  it("returns zero tension for zero wind", () => {
    expect(runHalyardTensionJib({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { halyardTensionNewtons: 0 },
    });
  });

  it("uses eight kilograms force per knot", () => {
    expect(runHalyardTensionJib({ apparentWindKt: 10 })).toEqual({
      ok: true,
      output: { halyardTensionNewtons: 784.5319999999999 },
    });
  });

  it("preserves fractional kilogram-force before converting", () => {
    const result = runHalyardTensionJib({ apparentWindKt: 12.4 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.halyardTensionNewtons).toBeCloseTo(99.2 * 9.80665, 12);
  });

  it("stays below the mainsail guide for the same wind", () => {
    const jib = runHalyardTensionJib({ apparentWindKt: 15 });
    if (!jib.ok) throw new Error("expected success");
    expect(jib.output.halyardTensionNewtons).toBeLessThan(1765.197);
  });

  it("rejects negative wind with a schema error", () => {
    expect(runHalyardTensionJib({ apparentWindKt: -0.5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "apparentWindKt" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runHalyardTensionJib({ apparentWindKt: 15, luffLengthMeters: 9 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "luffLengthMeters" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runHalyardTensionJib(null).ok).toBe(false);
    expect(runHalyardTensionJib({}).ok).toBe(false);
  });
});
