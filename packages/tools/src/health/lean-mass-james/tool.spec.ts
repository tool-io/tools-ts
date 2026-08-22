import { describe, expect, it } from "vitest";
import { leanMassJamesExample, runLeanMassJames } from "./tool.js";

describe("Lean Mass James Calculator", () => {
  it("matches the canonical example", () => {
    expect(runLeanMassJames(leanMassJamesExample.input)).toEqual({
      ok: true,
      output: leanMassJamesExample.output,
    });
  });

  it("defaults sex to male", () => {
    expect(runLeanMassJames({ weightKg: 2, heightM: 20 })).toEqual({
      ok: true,
      output: { leanMassKg: 0.9199999999999999 },
    });
  });

  it("computes the female equation exactly", () => {
    expect(
      runLeanMassJames({ weightKg: 2, heightM: 20, sex: "female" }),
    ).toEqual({ ok: true, output: { leanMassKg: 0.6599999999999999 } });
  });

  it("returns exact high precision results for both sexes", () => {
    expect(
      runLeanMassJames({ weightKg: 3.3, heightM: 25, sex: "male" }),
    ).toEqual({
      ok: true,
      output: { leanMassKg: 1.3997279999999996 },
    });
    expect(
      runLeanMassJames({ weightKg: 3.3, heightM: 25, sex: "female" }),
    ).toEqual({
      ok: true,
      output: { leanMassKg: 0.952248 },
    });
  });

  it("reports formula_not_applicable for typical adult inputs", () => {
    const result = runLeanMassJames({
      weightKg: 70,
      heightM: 1.75,
      sex: "male",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "formula_not_applicable",
        field: "bodyComposition",
      });
  });

  it("reports formula_not_applicable when the result is exactly zero", () => {
    const male = runLeanMassJames({
      weightKg: 0.1,
      heightM: 3.411211461689767,
      sex: "male",
    });
    const female = runLeanMassJames({
      weightKg: 0.05,
      heightM: 2.629807569094608,
      sex: "female",
    });
    expect(male.ok).toBe(false);
    expect(female.ok).toBe(false);
    if (!male.ok && !female.ok) {
      expect(male.error.issues[0].code).toBe("formula_not_applicable");
      expect(female.error.issues[0].field).toBe("bodyComposition");
    }
  });

  it("rejects zero weight with a stable code", () => {
    const result = runLeanMassJames({
      weightKg: 0,
      heightM: 20,
      sex: "male",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_weight",
        field: "weightKg",
      });
  });

  it("guards division by rejecting non positive heights with a stable code", () => {
    const zero = runLeanMassJames({
      weightKg: 2,
      heightM: 0,
      sex: "female",
    });
    const negative = runLeanMassJames({
      weightKg: 2,
      heightM: -20,
      sex: "female",
    });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toMatchObject({
        code: "invalid_height",
        field: "heightM",
      });
    expect(negative.ok).toBe(false);
    if (!negative.ok)
      expect(negative.error.issues[0].code).toBe("invalid_height");
  });

  it("rejects unknown sex values through the schema", () => {
    const result = runLeanMassJames({
      weightKg: 2,
      heightM: 20,
      sex: "n/a" as never,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects non object input and unknown fields", () => {
    expect(runLeanMassJames(undefined).ok).toBe(false);
    const result = runLeanMassJames({
      weightKg: 2,
      heightM: 20,
      extra: 1,
    });
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });

  it("rejects missing required fields", () => {
    const result = runLeanMassJames({ heightM: 20, sex: "male" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("weightKg");
  });
});
