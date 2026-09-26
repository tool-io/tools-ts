import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("econometrics/within-transform-group-mean", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(tool.execute({ values: [1, 5], groups: ["A", "A"] })).toEqual({
      ok: true,
      output: { groupMeans: [3, 3], centered: [-2, 2] },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
});

describe("batch 71 independent regressions", () => {
  it("centers each group independently", () => {
    expect(
      calculate({ values: [1, 3, 8, 12], groups: ["A", "A", "B", "B"] }),
    ).toEqual({ groupMeans: [2, 2, 10, 10], centered: [-1, 1, -2, 2] });
    expect(
      tool.execute({ values: [1, 3, 8, 12], groups: ["A", "A", "B", "B"] }),
    ).toEqual({
      ok: true,
      output: { groupMeans: [2, 2, 10, 10], centered: [-1, 1, -2, 2] },
    });
  });
});
