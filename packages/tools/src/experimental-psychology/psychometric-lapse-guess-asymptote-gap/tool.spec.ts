import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("experimental-psychology/psychometric-lapse-guess-asymptote-gap", () => {
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
        guessRate: 0.25,
        lapseRate: 0.05,
        latentProbability: 0.8,
      }),
    ).toEqual({
      ok: true,
      output: {
        lowerAsymptote: 0.25,
        upperAsymptote: 0.95,
        predictedProbability: 0.8099999999999999,
      },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite guessRate", (value) =>
    expect(tool.execute({ ...example.input, guessRate: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lapseRate", (value) =>
    expect(tool.execute({ ...example.input, lapseRate: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite latentProbability",
    (value) =>
      expect(
        tool.execute({ ...example.input, latentProbability: value }).ok,
      ).toBe(false),
  );
  it.each([
    { guessRate: -1 },
    { guessRate: 2 },
    { lapseRate: -1 },
    { lapseRate: 2 },
    { latentProbability: -1 },
    { latentProbability: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });

  it.each([
    { guessRate: -1 },
    { guessRate: 2 },
    { lapseRate: -1 },
    { lapseRate: 2 },
    { latentProbability: -1 },
    { latentProbability: 2 },
  ])("reviewed-domain direct validation %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrow();
    const result = tool.execute({ ...example.input, ...change });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect([
        "invalid_field",
        "invalid_domain",
        "result_out_of_range",
      ]).toContain(result.error.issues[0].code);
  });
});
