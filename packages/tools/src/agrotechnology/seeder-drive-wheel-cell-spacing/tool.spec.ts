import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agrotechnology/seeder-drive-wheel-cell-spacing", () => {
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
      tool.execute({ circumference: 3, cells: 30, driveRatio: 2, slip: 0 }),
    ).toEqual({ ok: true, output: { spacing: 0.05 } });
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
    "rejects nonfinite circumference",
    (value) =>
      expect(tool.execute({ ...example.input, circumference: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cells", (value) =>
    expect(tool.execute({ ...example.input, cells: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite driveRatio", (value) =>
    expect(tool.execute({ ...example.input, driveRatio: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite slip", (value) =>
    expect(tool.execute({ ...example.input, slip: value }).ok).toBe(false),
  );
  it.each([
    { circumference: 0 },
    { cells: 0 },
    { driveRatio: 0 },
    { slip: -1 },
    { slip: 1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { circumference: 0 },
    { cells: 0 },
    { driveRatio: 0 },
    { slip: -1 },
    { slip: 1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
