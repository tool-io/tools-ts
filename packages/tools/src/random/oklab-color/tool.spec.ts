import { describe, expect, it } from "vitest";
import { calculateRandomOklabColor, randomOklabColorExample, runRandomOklabColor } from "./tool.js";

describe("Random OKLab Color Generator", () => {
  it("uses injected randomness at the lower boundary", () => {
    expect(JSON.parse(JSON.stringify(randomOklabColorExample))).toEqual(randomOklabColorExample);expect(runRandomOklabColor(randomOklabColorExample.input,{random:()=>0}).ok).toBe(true);
    expect(calculateRandomOklabColor(() => 0)).toEqual({"lightness": 0, "a": -0.4, "b": -0.4});
  });

  it("is deterministic for a supplied sample", () => {
    expect(calculateRandomOklabColor(() => 0.5)).toEqual(calculateRandomOklabColor(() => 0.5));
  });

  it("rejects invalid randomness and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomOklabColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomOklabColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
