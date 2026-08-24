import { describe, expect, it } from "vitest";
import {
  calculateMeanAgeAtChildbearing,
  meanAgeAtChildbearingExample,
  meanAgeAtChildbearingTool,
  runMeanAgeAtChildbearing,
} from "./tool.js";

describe("meanAgeAtChildbearingTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runMeanAgeAtChildbearing(meanAgeAtChildbearingExample.input),
    ).toEqual({
      ok: true,
      output: meanAgeAtChildbearingExample.output,
    });
  });

  it("weights age by births and rejects negative birth counts", () => {
    expect(
      calculateMeanAgeAtChildbearing({
        birthsByAge: [1, 3],
        motherAges: [20, 30],
      }),
    ).toEqual({ meanAgeYears: 27.5 });
    const result = runMeanAgeAtChildbearing({
      birthsByAge: [1, -1],
      motherAges: [20, 30],
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("birthsByAge");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(meanAgeAtChildbearingExample))).toEqual(
      meanAgeAtChildbearingExample,
    );
    expect(meanAgeAtChildbearingTool.contractVersion).toBe(1);
    expect(meanAgeAtChildbearingTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMeanAgeAtChildbearing(null).ok).toBe(false);
    expect(
      runMeanAgeAtChildbearing({
        ...meanAgeAtChildbearingExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
