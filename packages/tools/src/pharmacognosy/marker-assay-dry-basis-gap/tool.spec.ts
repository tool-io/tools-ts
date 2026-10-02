import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacognosy/marker-assay-dry-basis-gap", () => {
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
        asReceivedFraction: 0.2,
        waterMassFraction: 0,
        suppliedDryFraction: 0.2,
      }),
    ).toEqual({ ok: true, output: { convertedDryFraction: 0.2, gap: 0 } });
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
    "rejects nonfinite asReceivedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, asReceivedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite waterMassFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, waterMassFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedDryFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedDryFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { asReceivedFraction: -1 },
    { asReceivedFraction: 2 },
    { waterMassFraction: -1 },
    { waterMassFraction: 1 },
    { suppliedDryFraction: -1 },
    { suppliedDryFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { asReceivedFraction: -1 },
    { asReceivedFraction: 2 },
    { waterMassFraction: -1 },
    { waterMassFraction: 1 },
    { suppliedDryFraction: -1 },
    { suppliedDryFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
