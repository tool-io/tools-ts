import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("json/json-number-exponent-negative-zero-label", () => {
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
    expect(tool.execute({ token: "-0" })).toEqual({
      ok: true,
      output: {
        exponentPresent: false,
        exponentNegative: false,
        exponentZero: false,
        negativeExponentZero: false,
      },
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

  it.each([{ token: "01e-0" }, { token: "1e-0\n" }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ token: "01e-0" }, { token: "1e-0\n" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("coefficient minus zero is distinct from exponent sign", () => {
    const output = calculate({ token: "-0e+0" });
    expect(output).toMatchObject({
      exponentPresent: true,
      exponentNegative: false,
      exponentZero: true,
      negativeExponentZero: false,
    });
    expect(tool.execute({ token: "-0e+0" })).toEqual({ ok: true, output });
  });
  it("multiple exponent zero digits retain negative spelling", () => {
    const output = calculate({ token: "1e-00000" });
    expect(output).toMatchObject({
      exponentPresent: true,
      exponentNegative: true,
      exponentZero: true,
      negativeExponentZero: true,
    });
    expect(tool.execute({ token: "1e-00000" })).toEqual({ ok: true, output });
  });
  it("rejects a terminal newline after numeric text", () => {
    expect(tool.execute({ token: "1e-0\n" })).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "token" }],
      },
    });
    expect(() => calculate({ token: "1e-0\n" })).toThrow();
  });
});
