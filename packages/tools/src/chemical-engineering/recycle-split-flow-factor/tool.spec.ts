import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("chemical-engineering/recycle-split-flow-factor", () => {
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
        grossFlow: 80,
        recycleFraction: 0.25,
        suppliedRecoveryFraction: 1,
      }),
    ).toEqual({
      ok: true,
      output: { recycledFlow: 20, recoveredRecycle: 20, netUnrecycled: 60 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite grossFlow", (value) =>
    expect(tool.execute({ ...example.input, grossFlow: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recycleFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, recycleFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedRecoveryFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedRecoveryFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { grossFlow: -1 },
    { recycleFraction: -1 },
    { recycleFraction: 2 },
    { suppliedRecoveryFraction: -1 },
    { suppliedRecoveryFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { grossFlow: -1 },
    { recycleFraction: -1 },
    { recycleFraction: 2 },
    { suppliedRecoveryFraction: -1 },
    { suppliedRecoveryFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
