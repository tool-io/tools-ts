import { describe, expect, it } from "vitest";
import {
  calculatePostponementProportion,
  postponementProportionIndexExample,
  postponementProportionIndexTool,
  runPostponementProportionIndex,
} from "./tool.js";

describe("postponementProportionIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runPostponementProportionIndex(postponementProportionIndexExample.input),
    ).toEqual({
      ok: true,
      output: postponementProportionIndexExample.output,
    });
  });

  it("returns the late-birth share and accepts a zero numerator", () => {
    expect(
      calculatePostponementProportion({
        birthsAtOrAboveReferenceAge: 0,
        totalBirths: 50,
      }),
    ).toEqual({ postponementProportion: 0 });
    const result = runPostponementProportionIndex({
      birthsAtOrAboveReferenceAge: 51,
      totalBirths: 50,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("birthsAtOrAboveReferenceAge");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(postponementProportionIndexExample)),
    ).toEqual(postponementProportionIndexExample);
    expect(postponementProportionIndexTool.contractVersion).toBe(1);
    expect(postponementProportionIndexTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runPostponementProportionIndex(null).ok).toBe(false);
    expect(
      runPostponementProportionIndex({
        ...postponementProportionIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
