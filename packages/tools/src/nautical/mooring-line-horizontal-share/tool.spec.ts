import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("nautical/mooring-line-horizontal-share", () => {
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
      tool.execute({ lineTension: 100, horizontalSpan: 0, verticalSpan: 5 }),
    ).toEqual({ ok: true, output: { horizontalTension: 0, share: 0 } });
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
    "rejects nonfinite lineTension",
    (value) =>
      expect(tool.execute({ ...example.input, lineTension: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite horizontalSpan",
    (value) =>
      expect(tool.execute({ ...example.input, horizontalSpan: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite verticalSpan",
    (value) =>
      expect(tool.execute({ ...example.input, verticalSpan: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ lineTension: -1 }])(
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
  it.each([{ lineTension: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 72 numerical range regressions", () => {
  it("scales line spans before evaluating direction", () => {
    const input = {
      lineTension: 100,
      horizontalSpan: 1.7e308,
      verticalSpan: 1.7e308,
    };
    const output = calculate(input);
    expect(output.share).toBeCloseTo(Math.SQRT1_2, 14);
    expect(output.horizontalTension).toBeCloseTo(100 * Math.SQRT1_2, 12);
    expect(tool.execute(input)).toEqual({ ok: true, output });
  });
});
