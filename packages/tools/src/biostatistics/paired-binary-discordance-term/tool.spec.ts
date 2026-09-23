import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biostatistics/paired-binary-discordance-term", () => {
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
      tool.execute({ firstOnly: 0, secondOnly: 0, continuityCorrection: 1 }),
    ).toEqual({
      ok: true,
      output: {
        difference: 0,
        correctedAbsoluteDifference: 0,
        statistic: 0,
        defined: false,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstOnly", (value) =>
    expect(tool.execute({ ...example.input, firstOnly: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite secondOnly", (value) =>
    expect(tool.execute({ ...example.input, secondOnly: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite continuityCorrection",
    (value) =>
      expect(
        tool.execute({ ...example.input, continuityCorrection: value }).ok,
      ).toBe(false),
  );
  it.each([
    { firstOnly: -1 },
    { secondOnly: -1 },
    { continuityCorrection: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstOnly: -1 },
    { secondOnly: -1 },
    { continuityCorrection: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 72 independent regressions", () => {
  it("clamps an explicit correction to zero before squaring", () => {
    const input = { firstOnly: 3, secondOnly: 3, continuityCorrection: 1 };
    expect(calculate(input)).toEqual({
      difference: 0,
      correctedAbsoluteDifference: 0,
      statistic: 0,
      defined: true,
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        difference: 0,
        correctedAbsoluteDifference: 0,
        statistic: 0,
        defined: true,
      },
    });
  });
});
