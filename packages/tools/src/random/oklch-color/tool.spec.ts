import { describe, expect, it } from "vitest";
import { calculateRandomOklchColor, randomOklchColorExample, runRandomOklchColor } from "./tool.js";

describe("Random OKLCH Color Generator", () => {
  it("uses injected randomness at the lower boundary", () => {
    expect(JSON.parse(JSON.stringify(randomOklchColorExample))).toEqual(randomOklchColorExample);expect(runRandomOklchColor(randomOklchColorExample.input,{random:()=>0}).ok).toBe(true);
    expect(calculateRandomOklchColor(() => 0)).toEqual({"lightness": 0, "chroma": 0, "hue": 0});
  });

  it("is deterministic for a supplied sample", () => {
    expect(calculateRandomOklchColor(() => 0.5)).toEqual(calculateRandomOklchColor(() => 0.5));
  });

  it("rejects invalid randomness and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomOklchColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomOklchColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
