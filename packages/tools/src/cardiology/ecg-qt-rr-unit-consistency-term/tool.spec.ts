import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("cardiology/ecg-qt-rr-unit-consistency-term", () => {
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
        qt: 0.3,
        rr: 0.8,
        qtSecondsPerUnit: 1,
        rrSecondsPerUnit: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        qtSeconds: 0.3,
        rrSeconds: 0.8,
        qtRrRatio: 0.37499999999999994,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite qt", (value) =>
    expect(tool.execute({ ...example.input, qt: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rr", (value) =>
    expect(tool.execute({ ...example.input, rr: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite qtSecondsPerUnit",
    (value) =>
      expect(
        tool.execute({ ...example.input, qtSecondsPerUnit: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rrSecondsPerUnit",
    (value) =>
      expect(
        tool.execute({ ...example.input, rrSecondsPerUnit: value }).ok,
      ).toBe(false),
  );
  it.each([
    { qt: -1 },
    { rr: 0 },
    { qtSecondsPerUnit: 0 },
    { rrSecondsPerUnit: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { qt: -1 },
    { rr: 0 },
    { qtSecondsPerUnit: 0 },
    { rrSecondsPerUnit: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
