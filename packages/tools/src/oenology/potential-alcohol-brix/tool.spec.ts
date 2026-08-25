import { describe, expect, it } from "vitest";
import {
  potentialAlcoholFromBrixExample,
  potentialAlcoholFromBrixTool,
  runPotentialAlcoholFromBrix,
} from "./tool.js";

describe("potentialAlcoholFromBrixTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runPotentialAlcoholFromBrix(potentialAlcoholFromBrixExample.input),
    ).toEqual({
      ok: true,
      output: potentialAlcoholFromBrixExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(potentialAlcoholFromBrixExample))).toEqual(
      potentialAlcoholFromBrixExample,
    );
    expect(potentialAlcoholFromBrixTool.contractVersion).toBe(1);
    expect(potentialAlcoholFromBrixTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runPotentialAlcoholFromBrix(null).ok).toBe(false);
    expect(
      runPotentialAlcoholFromBrix({
        ...potentialAlcoholFromBrixExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
