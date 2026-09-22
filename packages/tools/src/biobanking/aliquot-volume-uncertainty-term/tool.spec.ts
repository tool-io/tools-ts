import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biobanking/aliquot-volume-uncertainty-term", () => {
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
        dispenses: 4,
        perDispenseStandardUncertainty: 0.1,
        correlation: 1,
      }),
    ).toEqual({ ok: true, output: { standardUncertainty: 0.4 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite dispenses", (value) =>
    expect(tool.execute({ ...example.input, dispenses: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite perDispenseStandardUncertainty",
    (value) =>
      expect(
        tool.execute({
          ...example.input,
          perDispenseStandardUncertainty: value,
        }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite correlation",
    (value) =>
      expect(tool.execute({ ...example.input, correlation: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { correlation: -0.5 },
    { dispenses: 0 },
    { perDispenseStandardUncertainty: -1 },
    { correlation: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { correlation: -0.5 },
    { dispenses: 0 },
    { perDispenseStandardUncertainty: -1 },
    { correlation: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("permits the singular lower equicorrelation boundary", () => {
    const output = calculate({
      dispenses: 4,
      perDispenseStandardUncertainty: 0.1,
      correlation: -0.3333333333333333,
    });
    expect(output).toMatchObject({ standardUncertainty: 0 });
    expect(
      tool.execute({
        dispenses: 4,
        perDispenseStandardUncertainty: 0.1,
        correlation: -0.3333333333333333,
      }),
    ).toEqual({ ok: true, output });
  });
  it("a single dispense has its own standard uncertainty", () => {
    const output = calculate({
      dispenses: 1,
      perDispenseStandardUncertainty: 0.1,
      correlation: -1,
    });
    expect(output).toMatchObject({ standardUncertainty: 0.1 });
    expect(
      tool.execute({
        dispenses: 1,
        perDispenseStandardUncertainty: 0.1,
        correlation: -1,
      }),
    ).toEqual({ ok: true, output });
  });
});
