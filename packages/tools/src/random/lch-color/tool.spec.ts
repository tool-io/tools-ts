import { describe, expect, it } from "vitest";
import { calculateRandomLchColor, randomLchColorExample, runRandomLchColor } from "./tool.js";

describe("Random CIELCH Color Generator", () => {
  it("uses injected randomness at the lower boundary", () => {
    expect(JSON.parse(JSON.stringify(randomLchColorExample))).toEqual(randomLchColorExample);expect(runRandomLchColor(randomLchColorExample.input,{random:()=>0}).ok).toBe(true);
    expect(calculateRandomLchColor(() => 0)).toEqual({"lightness": 0, "chroma": 0, "hue": 0});
  });

  it("is deterministic for a supplied sample", () => {
    expect(calculateRandomLchColor(() => 0.5)).toEqual(calculateRandomLchColor(() => 0.5));
  });

  it("rejects invalid randomness and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomLchColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomLchColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
