import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runFittsLawMovementTime, fittsLawMovementTimeTool, fittsLawMovementTimeInputSchema, fittsLawMovementTimeOutputSchema } from "./index.js";
describe("Fitts Law Movement Time", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(fittsLawMovementTimeTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, fittsLawMovementTimeInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, fittsLawMovementTimeOutputSchema)).toBe(true);
    expect(runFittsLawMovementTime(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runFittsLawMovementTime({"distance":0,"width":20,"interceptMs":100,"slopeMsPerBit":80})).toEqual({ok: true, output: {"indexOfDifficultyBits":0,"movementTimeMs":100}}));
  it("matches independent case 2", () => expect(runFittsLawMovementTime({"distance":100,"width":100,"interceptMs":-10,"slopeMsPerBit":80})).toEqual({ok: true, output: {"indexOfDifficultyBits":1,"movementTimeMs":70}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runFittsLawMovementTime({"distance":700,"width":0,"interceptMs":100,"slopeMsPerBit":80});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "width", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runFittsLawMovementTime(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
