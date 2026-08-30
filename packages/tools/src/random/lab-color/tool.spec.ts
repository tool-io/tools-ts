import { describe, expect, it } from "vitest";
import { calculateRandomLabColor, randomLabColorExample, runRandomLabColor } from "./tool.js";

describe("Random CIELAB Color Generator", () => {
  it("uses injected randomness at the lower boundary", () => {
    expect(JSON.parse(JSON.stringify(randomLabColorExample))).toEqual(randomLabColorExample);expect(runRandomLabColor(randomLabColorExample.input,{random:()=>0}).ok).toBe(true);
    expect(calculateRandomLabColor(() => 0)).toEqual({"lightness": 0, "a": -128, "b": -128});
  });

  it("is deterministic for a supplied sample", () => {
    expect(calculateRandomLabColor(() => 0.5)).toEqual(calculateRandomLabColor(() => 0.5));
  });

  it("rejects invalid randomness and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomLabColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomLabColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
