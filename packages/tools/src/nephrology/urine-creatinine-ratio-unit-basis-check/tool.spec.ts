import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("nephrology/urine-creatinine-ratio-unit-basis-check", () => {
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
        numeratorValue: 12,
        denominatorValue: 6,
        numeratorScale: 0.1,
        denominatorScale: 1,
        reportScale: 10,
      }),
    ).toEqual({
      ok: true,
      output: {
        coherentRatio: 0.20000000000000004,
        reportedRatio: 2.0000000000000004,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite numeratorValue",
    (value) =>
      expect(tool.execute({ ...example.input, numeratorValue: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite denominatorValue",
    (value) =>
      expect(
        tool.execute({ ...example.input, denominatorValue: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite numeratorScale",
    (value) =>
      expect(tool.execute({ ...example.input, numeratorScale: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite denominatorScale",
    (value) =>
      expect(
        tool.execute({ ...example.input, denominatorScale: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reportScale",
    (value) =>
      expect(tool.execute({ ...example.input, reportScale: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { numeratorValue: -1 },
    { denominatorValue: 0 },
    { numeratorScale: 0 },
    { denominatorScale: 0 },
    { reportScale: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { numeratorValue: -1 },
    { denominatorValue: 0 },
    { numeratorScale: 0 },
    { denominatorScale: 0 },
    { reportScale: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
