import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-economics/import-tariff-basis-margin", () => {
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
        importValue: 100,
        excludedValue: 0,
        specificDuty: 0,
        suppliedRate: 0,
        suppliedDuty: 0,
      }),
    ).toEqual({
      ok: true,
      output: { adValoremBase: 100, modeledDuty: 0, margin: 0 },
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
    "rejects nonfinite importValue",
    (value) =>
      expect(tool.execute({ ...example.input, importValue: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite excludedValue",
    (value) =>
      expect(tool.execute({ ...example.input, excludedValue: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite specificDuty",
    (value) =>
      expect(tool.execute({ ...example.input, specificDuty: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedRate",
    (value) =>
      expect(tool.execute({ ...example.input, suppliedRate: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedDuty",
    (value) =>
      expect(tool.execute({ ...example.input, suppliedDuty: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { importValue: -1 },
    { excludedValue: -1 },
    { specificDuty: -1 },
    { suppliedRate: -1 },
    { suppliedDuty: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { importValue: -1 },
    { excludedValue: -1 },
    { specificDuty: -1 },
    { suppliedRate: -1 },
    { suppliedDuty: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
