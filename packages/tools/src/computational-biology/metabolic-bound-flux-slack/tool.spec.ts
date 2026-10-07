import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-biology/metabolic-bound-flux-slack", () => {
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
    expect(tool.execute({ flux: -2, lowerBound: 0, upperBound: 10 })).toEqual({
      ok: true,
      output: { lowerSlack: -2, upperSlack: 12, feasible: false },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite flux", (value) =>
    expect(tool.execute({ ...example.input, flux: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lowerBound", (value) =>
    expect(tool.execute({ ...example.input, lowerBound: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite upperBound", (value) =>
    expect(tool.execute({ ...example.input, upperBound: value }).ok).toBe(
      false,
    ),
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ flux: 0, lowerBound: 0, upperBound: 10 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { lowerSlack: 0, upperSlack: 10, feasible: true },
    });
    expect(calculate(input)).toEqual({
      lowerSlack: 0,
      upperSlack: 10,
      feasible: true,
    });
  });
});
