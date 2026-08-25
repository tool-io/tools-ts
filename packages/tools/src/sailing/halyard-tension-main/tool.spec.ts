import { describe, expect, it } from "vitest";
import { halyardTensionMainExample, runHalyardTensionMain } from "./tool.js";

describe("Main Halyard Tension Guide", () => {
  it("calculates the canonical example exactly", () => {
    expect(runHalyardTensionMain(halyardTensionMainExample.input)).toEqual({
      ok: true,
      output: { halyardTensionNewtons: 1765.197 },
    });
  });

  it("returns zero tension for zero wind", () => {
    expect(runHalyardTensionMain({ apparentWindKt: 0 })).toEqual({
      ok: true,
      output: { halyardTensionNewtons: 0 },
    });
  });

  it("preserves fractional kilogram-force before converting", () => {
    expect(runHalyardTensionMain({ apparentWindKt: 12.4 })).toEqual({
      ok: true,
      output: { halyardTensionNewtons: 1459.22952 },
    });
  });

  it("accepts fractional knots", () => {
    const result = runHalyardTensionMain({ apparentWindKt: 10.25 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.halyardTensionNewtons).toBeCloseTo(123 * 9.80665, 12);
  });

  it("grows linearly with apparent wind", () => {
    const low = runHalyardTensionMain({ apparentWindKt: 10 });
    const high = runHalyardTensionMain({ apparentWindKt: 20 });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.halyardTensionNewtons).toBeCloseTo(
      Number(low.output.halyardTensionNewtons) * 2,
      12,
    );
  });

  it("rejects negative wind with a schema error", () => {
    expect(runHalyardTensionMain({ apparentWindKt: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "apparentWindKt" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runHalyardTensionMain({ apparentWindKt: 15, trueWindKt: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "trueWindKt" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runHalyardTensionMain(null).ok).toBe(false);
    expect(runHalyardTensionMain({}).ok).toBe(false);
  });
});
