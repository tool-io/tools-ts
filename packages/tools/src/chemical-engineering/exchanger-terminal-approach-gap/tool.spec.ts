import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("chemical-engineering/exchanger-terminal-approach-gap", () => {
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
        hotIn: 100,
        hotOut: 60,
        coldIn: 20,
        coldOut: 50,
        countercurrent: false,
      }),
    ).toEqual({
      ok: true,
      output: { firstApproach: 80, secondApproach: 10, minimumApproach: 10 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite hotIn", (value) =>
    expect(tool.execute({ ...example.input, hotIn: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite hotOut", (value) =>
    expect(tool.execute({ ...example.input, hotOut: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite coldIn", (value) =>
    expect(tool.execute({ ...example.input, coldIn: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite coldOut", (value) =>
    expect(tool.execute({ ...example.input, coldOut: value }).ok).toBe(false),
  );
});

describe("batch 72 independent regressions", () => {
  it("preserves a signed terminal temperature crossing", () => {
    const input = {
      hotIn: 100,
      hotOut: 40,
      coldIn: 20,
      coldOut: 60,
      countercurrent: false,
    };
    expect(calculate(input)).toEqual({
      firstApproach: 80,
      secondApproach: -20,
      minimumApproach: -20,
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { firstApproach: 80, secondApproach: -20, minimumApproach: -20 },
    });
  });
});
