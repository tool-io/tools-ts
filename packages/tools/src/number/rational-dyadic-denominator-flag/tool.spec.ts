import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("number/rational-dyadic-denominator-flag", () => {
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
    expect(tool.execute({ numerator: "3", denominator: "9" })).toEqual({
      ok: true,
      output: { reducedDenominator: "3", dyadic: false, exponent: -1 },
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

  it.each([{ denominator: "0" }, { numerator: "1.2" }])(
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
  it.each([{ denominator: "0" }, { numerator: "1.2" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("zero rational reduces to denominator one", () => {
    const output = calculate({ numerator: "0", denominator: "-12" });
    expect(output).toMatchObject({
      reducedDenominator: "1",
      dyadic: true,
      exponent: 0,
    });
    expect(tool.execute({ numerator: "0", denominator: "-12" })).toEqual({
      ok: true,
      output,
    });
  });
  it("signs do not change reduced dyadic denominator", () => {
    const output = calculate({ numerator: "-12", denominator: "-32" });
    expect(output).toMatchObject({
      reducedDenominator: "8",
      dyadic: true,
      exponent: 3,
    });
    expect(tool.execute({ numerator: "-12", denominator: "-32" })).toEqual({
      ok: true,
      output,
    });
  });
  it("zero denominator produces a field-specific domain issue", () => {
    expect(tool.execute({ numerator: "6", denominator: "0" })).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "denominator" }],
      },
    });
    expect(() => calculate({ numerator: "6", denominator: "0" })).toThrow();
  });
});
