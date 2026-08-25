import { describe, expect, it } from "vitest";
import { anionGapExample, runAnionGap } from "./tool.js";

describe("Anion Gap", () => {
  it("publishes an executable example", () =>
    expect(runAnionGap(anionGapExample.input)).toEqual({
      ok: true,
      output: anionGapExample.output,
    }));
  it("subtracts chloride plus bicarbonate from sodium", () =>
    expect(
      runAnionGap({
        bicarbonateMmolL: 25,
        chlorideMmolL: 100,
        sodiumMmolL: 135,
      }),
    ).toEqual({ ok: true, output: { anionGap: 10 } }));
  it("computes another valid result", () =>
    expect(
      runAnionGap({
        bicarbonateMmolL: 22,
        chlorideMmolL: 98,
        sodiumMmolL: 140,
      }),
    ).toEqual({ ok: true, output: { anionGap: 20 } }));
  it("rejects zero sodium", () => {
    const result = runAnionGap({
      bicarbonateMmolL: 24,
      chlorideMmolL: 104,
      sodiumMmolL: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero bicarbonate", () => {
    const result = runAnionGap({
      bicarbonateMmolL: 0,
      chlorideMmolL: 104,
      sodiumMmolL: 140,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative chloride", () => {
    const result = runAnionGap({
      bicarbonateMmolL: 24,
      chlorideMmolL: -104,
      sodiumMmolL: 140,
    });
    expect(result.ok).toBe(false);
  });
});
