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
    expect(runLeanMassJames({ weightKg: 80, heightM: 1.85 })).toEqual({
      ok: true,
      output: { leanMassKg: 64.06428049671293 },
    });
  });

  it("computes the female equation exactly", () => {
    expect(
      runLeanMassJames({ weightKg: 60, heightM: 1.65, sex: "female" }),
    ).toEqual({ ok: true, output: { leanMassKg: 44.62975206611571 } });
  });

  it("returns exact high precision results for both sexes", () => {
    expect(
      runLeanMassJames({ weightKg: 92.5, heightM: 1.79, sex: "male" }),
    ).toEqual({
      ok: true,
      output: { leanMassKg: 67.56879466932993 },
    });
    expect(
      runLeanMassJames({ weightKg: 55, heightM: 1.62, sex: "female" }),
    ).toEqual({
      ok: true,
      output: { leanMassKg: 41.79086267337296 },
    });
  });

  it("reports formula_not_applicable when lean mass is not positive", () => {
    const result = runLeanMassJames({
      weightKg: 30,
      heightM: 0.5,
      sex: "male",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "formula_not_applicable",
        field: "bodyComposition",
      });
  });

  it("rejects non-positive weight and height with stable issue fields", () => {
    const weight = runLeanMassJames({ weightKg: 0, heightM: 1.8 });
    const height = runLeanMassJames({ weightKg: 70, heightM: 0 });
    expect(weight.ok).toBe(false);
    expect(height.ok).toBe(false);
    if (!weight.ok)
      expect(weight.error.issues[0]).toMatchObject({
        code: "invalid_weight",
        field: "weightKg",
      });
    if (!height.ok)
      expect(height.error.issues[0]).toMatchObject({
        code: "invalid_height",
        field: "heightM",
      });
  });

  it("rejects missing, unknown, or malformed fields", () => {
    expect(runLeanMassJames({ heightM: 1.8, sex: "male" }).ok).toBe(false);
    expect(
      runLeanMassJames({ weightKg: 70, heightM: 1.8, sex: "other" as never })
        .ok,
    ).toBe(false);
    expect(
      runLeanMassJames({ weightKg: 70, heightM: 1.8, extra: true }).ok,
    ).toBe(false);
  });
});
