import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("gmp/gmp-packaging-count-residual", () => {
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
        inputUnits: 100,
        packedUnits: 95,
        rejectedUnits: 10,
        sampledUnits: 0,
      }),
    ).toEqual({ ok: true, output: { unaccountedUnits: -5 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite inputUnits", (value) =>
    expect(tool.execute({ ...example.input, inputUnits: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite packedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, packedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rejectedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, rejectedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sampledUnits",
    (value) =>
      expect(tool.execute({ ...example.input, sampledUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { inputUnits: -1 },
    { packedUnits: -1 },
    { rejectedUnits: -1 },
    { sampledUnits: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { inputUnits: -1 },
    { packedUnits: -1 },
    { rejectedUnits: -1 },
    { sampledUnits: -1 },
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
        inputUnits: 9007199254740991,
        packedUnits: 9007199254740981,
        rejectedUnits: 3,
        sampledUnits: 2,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { unaccountedUnits: 5 },
    });
    expect(calculate(input)).toEqual({ unaccountedUnits: 5 });
  });
});
