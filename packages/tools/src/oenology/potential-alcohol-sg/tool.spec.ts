import { describe, expect, it } from "vitest";
import {
  potentialAlcoholFromSgExample,
  potentialAlcoholFromSgTool,
  runPotentialAlcoholFromSg,
} from "./tool.js";

describe("potentialAlcoholFromSgTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runPotentialAlcoholFromSg(potentialAlcoholFromSgExample.input),
    ).toEqual({
      ok: true,
      output: potentialAlcoholFromSgExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(potentialAlcoholFromSgExample))).toEqual(
      potentialAlcoholFromSgExample,
    );
    expect(potentialAlcoholFromSgTool.contractVersion).toBe(1);
    expect(potentialAlcoholFromSgTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runPotentialAlcoholFromSg(null).ok).toBe(false);
    expect(
      runPotentialAlcoholFromSg({
        ...potentialAlcoholFromSgExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects must specific gravity below water", () => {
    expect(
      runPotentialAlcoholFromSg({
        abvPercentPerBrix: 0.59,
        specificGravity: 0.99,
      }).ok,
    ).toBe(false);
  });
});
