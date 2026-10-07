import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("atmospheric-science/atmospheric-column-layer-dry-mass", () => {
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
        bottomPressurePascals: 90000,
        topPressurePascals: 90000,
        suppliedGravity: 9.8,
        waterMassFraction: 0,
      }),
    ).toEqual({ ok: true, output: { dryMassKilogramsPerSquareMeter: 0 } });
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite bottomPressurePascals",
    (value) =>
      expect(
        tool.execute({ ...example.input, bottomPressurePascals: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite topPressurePascals",
    (value) =>
      expect(
        tool.execute({ ...example.input, topPressurePascals: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedGravity",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedGravity: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite waterMassFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, waterMassFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { topPressurePascals: -1 },
    { suppliedGravity: 0 },
    { waterMassFraction: -1 },
    { waterMassFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { topPressurePascals: -1 },
    { suppliedGravity: 0 },
    { waterMassFraction: -1 },
    { waterMassFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        bottomPressurePascals: 100000,
        topPressurePascals: 90000,
        suppliedGravity: 10,
        waterMassFraction: 1,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { dryMassKilogramsPerSquareMeter: 0 },
    });
    expect(calculate(input)).toEqual({ dryMassKilogramsPerSquareMeter: 0 });
  });
});
