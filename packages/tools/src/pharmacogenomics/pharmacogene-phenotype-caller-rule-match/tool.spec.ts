import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacogenomics/pharmacogene-phenotype-caller-rule-match", () => {
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
    expect(
      tool.execute({
        activity: 1.5,
        lower: [0, 1],
        upper: [2, 3],
        labels: ["X", "Y"],
      }),
    ).toEqual({ ok: true, output: { matches: ["X", "Y"], ambiguous: true } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite activity", (value) =>
    expect(tool.execute({ ...example.input, activity: value }).ok).toBe(false),
  );
});

describe("batch 67 review regressions", () => {
  it("keeps overlapping caller rules ambiguous and upper endpoints exclusive", () => {
    expect(
      calculate({
        activity: 1.5,
        lower: [0, 1],
        upper: [2, 3],
        labels: ["A", "B"],
      }),
    ).toEqual({ matches: ["A", "B"], ambiguous: true });
    expect(
      calculate({
        activity: 3,
        lower: [0, 1],
        upper: [2, 3],
        labels: ["A", "B"],
      }),
    ).toEqual({ matches: [], ambiguous: false });
  });
});
