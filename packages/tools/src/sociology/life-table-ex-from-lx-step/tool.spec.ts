import { describe, expect, it } from "vitest";
import {
  calculateLifeTableExStep,
  lifeTableExFromLxStepExample,
  lifeTableExFromLxStepTool,
  runLifeTableExFromLxStep,
} from "./tool.js";

describe("lifeTableExFromLxStepTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runLifeTableExFromLxStep(lifeTableExFromLxStepExample.input),
    ).toEqual({
      ok: true,
      output: lifeTableExFromLxStepExample.output,
    });
  });

  it("uses the trapezoidal Lx approximation and rejects increasing survivorship", () => {
    expect(
      calculateLifeTableExStep({
        intervalWidthN: 2,
        lxAgeX: 100,
        lxNextAge: 80,
        tailPersonYears: 0,
      }),
    ).toEqual({ lifeExpectancyEx: 1.8, personYearsLivedLx: 180 });
    const result = runLifeTableExFromLxStep({
      intervalWidthN: 1,
      lxAgeX: 100,
      lxNextAge: 101,
      tailPersonYears: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("lxNextAge");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(lifeTableExFromLxStepExample))).toEqual(
      lifeTableExFromLxStepExample,
    );
    expect(lifeTableExFromLxStepTool.contractVersion).toBe(1);
    expect(lifeTableExFromLxStepTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runLifeTableExFromLxStep(null).ok).toBe(false);
    expect(
      runLifeTableExFromLxStep({
        ...lifeTableExFromLxStepExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
