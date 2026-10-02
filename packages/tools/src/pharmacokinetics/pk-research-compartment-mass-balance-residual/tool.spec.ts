import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacokinetics/pk-research-compartment-mass-balance-residual", () => {
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
        opening: 50,
        input: 0,
        eliminated: 10,
        transferredOut: 5,
        transferredIn: 0,
        measuredClosing: 35,
      }),
    ).toEqual({
      ok: true,
      output: { expectedClosing: 35, residual: 0, totalOut: 15 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite opening", (value) =>
    expect(tool.execute({ ...example.input, opening: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite input", (value) =>
    expect(tool.execute({ ...example.input, input: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite eliminated", (value) =>
    expect(tool.execute({ ...example.input, eliminated: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite transferredOut",
    (value) =>
      expect(tool.execute({ ...example.input, transferredOut: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite transferredIn",
    (value) =>
      expect(tool.execute({ ...example.input, transferredIn: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite measuredClosing",
    (value) =>
      expect(
        tool.execute({ ...example.input, measuredClosing: value }).ok,
      ).toBe(false),
  );
  it.each([
    { opening: -1 },
    { input: -1 },
    { eliminated: -1 },
    { transferredOut: -1 },
    { transferredIn: -1 },
    { measuredClosing: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { opening: -1 },
    { input: -1 },
    { eliminated: -1 },
    { transferredOut: -1 },
    { transferredIn: -1 },
    { measuredClosing: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
