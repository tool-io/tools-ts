import { describe, expect, it } from "vitest";
import { calculateRandomDisplayP3Color, randomDisplayP3ColorExample, runRandomDisplayP3Color } from "./tool.js";

describe("Random Display P3 Color Generator", () => {
  it("uses injected randomness at the lower boundary", () => {
    expect(JSON.parse(JSON.stringify(randomDisplayP3ColorExample))).toEqual(randomDisplayP3ColorExample);expect(runRandomDisplayP3Color(randomDisplayP3ColorExample.input,{random:()=>0}).ok).toBe(true);
    expect(calculateRandomDisplayP3Color(() => 0)).toEqual({"red": 0, "green": 0, "blue": 0});
  });

  it("is deterministic for a supplied sample", () => {
    expect(calculateRandomDisplayP3Color(() => 0.5)).toEqual(calculateRandomDisplayP3Color(() => 0.5));
  });

  it("rejects invalid randomness and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomDisplayP3Color({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomDisplayP3Color({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
