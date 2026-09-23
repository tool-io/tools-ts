import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("botany/root-shoot-water-basis-factor", () => {
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
        rootWet: 8,
        shootWet: 16,
        rootWaterFraction: 0.5,
        shootWaterFraction: 0.5,
      }),
    ).toEqual({ ok: true, output: { rootDry: 4, shootDry: 8, dryRatio: 0.5 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rootWet", (value) =>
    expect(tool.execute({ ...example.input, rootWet: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite shootWet", (value) =>
    expect(tool.execute({ ...example.input, shootWet: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rootWaterFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, rootWaterFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite shootWaterFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, shootWaterFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { rootWet: -1 },
    { shootWet: 0 },
    { rootWaterFraction: -1 },
    { rootWaterFraction: 2 },
    { shootWaterFraction: -1 },
    { shootWaterFraction: 1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { rootWet: -1 },
    { shootWet: 0 },
    { rootWaterFraction: -1 },
    { rootWaterFraction: 2 },
    { shootWaterFraction: -1 },
    { shootWaterFraction: 1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
