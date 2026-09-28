import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-informatics/dicom-decimal-string-scale", () => {
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
    expect(tool.execute({ token: ".125" })).toEqual({
      ok: true,
      output: { fractionDigits: 3, exponent: 0, lexicalScale: 3 },
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

  it.each([
    { token: "\t1.2" },
    { token: "1.2\n" },
    { token: "1.2 3" },
    { token: "1e" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { token: "\t1.2" },
    { token: "1.2\n" },
    { token: "1.2 3" },
    { token: "1e" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("accepts ASCII padding and a negative exponent", () => {
    const output = calculate({ token: " -1.250e-2 " });
    expect(output).toMatchObject({
      fractionDigits: 3,
      exponent: -2,
      lexicalScale: 5,
    });
    expect(tool.execute({ token: " -1.250e-2 " })).toEqual({
      ok: true,
      output,
    });
  });
  it("inspects large lexical exponents without numeric evaluation", () => {
    const output = calculate({ token: "1e99999999999999" });
    expect(output).toMatchObject({
      fractionDigits: 0,
      exponent: 99999999999999,
      lexicalScale: -99999999999999,
    });
    expect(tool.execute({ token: "1e99999999999999" })).toEqual({
      ok: true,
      output,
    });
  });
  it("does not silently trim non-ASCII padding", () => {
    expect(tool.execute({ token: " 1.2" })).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "token" }],
      },
    });
    expect(() => calculate({ token: " 1.2" })).toThrow();
  });
});
