import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./index.js";
const expectIssue = (input: unknown, field: string, code: string): void => {
  const result = tool.execute(input);
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected a structured input error.");
  expect(result.error.code).toBe("invalid_input");
  expect(result.error.issues).toEqual(
    expect.arrayContaining([expect.objectContaining({ field, code })]),
  );
};
describe(tool.id, () => {
  it("executes the canonical example exactly", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expectIssue({}, "errorProbabilities", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("returns positive zero for certainty and finite subnormal scores", () => {
    const output = calculate({ errorProbabilities: [1, Number.MIN_VALUE] });
    expect(Object.is(output.phredScores[0], 0)).toBe(true);
    expect(output.phredScores[1]).toBeCloseTo(3233.062153431158, 9);
  });
  it("converts a half-error probability without rounding and orders scores", () => {
    const output = calculate({ errorProbabilities: [0.5, 0.25, 0.1] });
    expect(output.phredScores[0]).toBeCloseTo(3.010299956639812, 12);
    expect(output.phredScores[1]).toBeGreaterThan(output.phredScores[0]);
    expect(output.phredScores[2]).toBeGreaterThan(output.phredScores[1]);
  });
  it("rejects empty lists and probabilities outside (0, 1]", () => {
    for (const errorProbabilities of [[], [0], [-0.1], [1.1], [Infinity], [NaN]])
      expectIssue({ errorProbabilities }, "errorProbabilities", "invalid_field");
  });

  it("rejects sparse numeric lists before calculating output", () => {
    expectIssue({ ...example.input, errorProbabilities: new Array<number>(2) }, "errorProbabilities", "invalid_field");
  });
});
