import { describe, expect, it } from "vitest";
import { idealWeightDevineExample, runIdealWeightDevine } from "./tool.js";

describe("Ideal Weight Devine Calculator", () => {
  it("matches the canonical example", () => {
    expect(runIdealWeightDevine(idealWeightDevineExample.input)).toEqual({
      ok: true,
      output: idealWeightDevineExample.output,
    });
  });

  it("defaults sex to male", () => {
    expect(runIdealWeightDevine({ heightCm: 180 })).toEqual({
      ok: true,
      output: { idealWeightKg: 74.99212598425197 },
    });
  });

  it("computes the female baseline exactly", () => {
    expect(runIdealWeightDevine({ heightCm: 180, sex: "female" })).toEqual({
      ok: true,
      output: { idealWeightKg: 70.49212598425197 },
    });
  });

  it("returns the exact male and female baselines at five feet", () => {
    expect(runIdealWeightDevine({ heightCm: 152.4, sex: "male" })).toEqual({
      ok: true,
      output: { idealWeightKg: 50 },
    });
    expect(runIdealWeightDevine({ heightCm: 152.4, sex: "female" })).toEqual({
      ok: true,
      output: { idealWeightKg: 45.5 },
    });
  });

  it("clamps heights below five feet to the baseline", () => {
    expect(runIdealWeightDevine({ heightCm: 150, sex: "male" })).toEqual({
      ok: true,
      output: { idealWeightKg: 50 },
    });
    expect(runIdealWeightDevine({ heightCm: 120, sex: "female" })).toEqual({
      ok: true,
      output: { idealWeightKg: 45.5 },
    });
  });

  it("adds exactly 2.3 kg per inch over five feet", () => {
    const at = runIdealWeightDevine({ heightCm: 177.8, sex: "male" });
    const above = runIdealWeightDevine({ heightCm: 180.34, sex: "male" });
    expect(
      at.ok && above.ok
        ? (above.output.idealWeightKg as number) -
            (at.output.idealWeightKg as number)
        : Number.NaN,
    ).toBeCloseTo(2.3, 12);
  });

  it("returns an exact high precision result", () => {
    expect(runIdealWeightDevine({ heightCm: 183.4, sex: "male" })).toEqual({
      ok: true,
      output: { idealWeightKg: 78.07086614173227 },
    });
  });

  it("rejects zero and negative heights with a stable code", () => {
    const zero = runIdealWeightDevine({ heightCm: 0, sex: "male" });
    const negative = runIdealWeightDevine({ heightCm: -180 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toMatchObject({
        code: "invalid_height",
        field: "heightCm",
      });
    expect(negative.ok).toBe(false);
    if (!negative.ok)
      expect(negative.error.issues[0].code).toBe("invalid_height");
  });

  it("rejects unknown sex values through the schema", () => {
    const result = runIdealWeightDevine({
      heightCm: 180,
      sex: "other" as never,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects non object input and unknown fields", () => {
    expect(runIdealWeightDevine("180").ok).toBe(false);
    const result = runIdealWeightDevine({ heightCm: 180, extra: 1 });
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });

  it("rejects missing required fields", () => {
    const result = runIdealWeightDevine({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("heightCm");
  });
});
