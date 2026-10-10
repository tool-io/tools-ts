import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("occupational-therapy/assistive-device-loan-balance", () => {
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
        openingCount: 2,
        issuedCount: 0,
        returnedCount: 3,
        writtenOffCount: 0,
      }),
    ).toEqual({ ok: true, output: { outstandingCount: -1 } });
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
    "rejects nonfinite openingCount",
    (value) =>
      expect(tool.execute({ ...example.input, openingCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite issuedCount",
    (value) =>
      expect(tool.execute({ ...example.input, issuedCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite returnedCount",
    (value) =>
      expect(tool.execute({ ...example.input, returnedCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite writtenOffCount",
    (value) =>
      expect(
        tool.execute({ ...example.input, writtenOffCount: value }).ok,
      ).toBe(false),
  );
  it.each([
    { openingCount: -1 },
    { issuedCount: -1 },
    { returnedCount: -1 },
    { writtenOffCount: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { openingCount: -1 },
    { issuedCount: -1 },
    { returnedCount: -1 },
    { writtenOffCount: -1 },
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
        openingCount: 9007199254740991,
        issuedCount: 5,
        returnedCount: 9007199254740991,
        writtenOffCount: 2,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { outstandingCount: 3 },
    });
    expect(calculate(input)).toEqual({ outstandingCount: 3 });
  });
});
