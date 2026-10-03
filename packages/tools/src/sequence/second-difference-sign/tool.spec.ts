import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("sequence/second-difference-sign", () => {
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
        first: 1,
        second: 2,
        third: 3,
        tolerance: 0,
        equalityWithinTolerance: true,
      }),
    ).toEqual({ ok: true, output: { sign: 0, difference: 0 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite first", (value) =>
    expect(tool.execute({ ...example.input, first: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite second", (value) =>
    expect(tool.execute({ ...example.input, second: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite third", (value) =>
    expect(tool.execute({ ...example.input, third: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tolerance", (value) =>
    expect(tool.execute({ ...example.input, tolerance: value }).ok).toBe(false),
  );
  it.each([{ tolerance: -1 }])(
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
  it.each([{ tolerance: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 71 independent regressions", () => {
  it("centers equal huge observations before applying weights", () => {
    expect(
      calculate({
        first: 1e308,
        second: 1e308,
        third: 1e308,
        tolerance: 0,
        equalityWithinTolerance: true,
      }),
    ).toEqual({ sign: 0, difference: 0 });
    expect(
      tool.execute({
        first: 1e308,
        second: 1e308,
        third: 1e308,
        tolerance: 0,
        equalityWithinTolerance: true,
      }),
    ).toEqual({ ok: true, output: { sign: 0, difference: 0 } });
  });
  it("honors a closed tolerance boundary", () => {
    expect(
      calculate({
        first: 1,
        second: 2,
        third: 4,
        tolerance: 1,
        equalityWithinTolerance: true,
      }),
    ).toEqual({ sign: 0, difference: 1 });
    expect(
      tool.execute({
        first: 1,
        second: 2,
        third: 4,
        tolerance: 1,
        equalityWithinTolerance: true,
      }),
    ).toEqual({ ok: true, output: { sign: 0, difference: 1 } });
  });
  it("honors an open tolerance boundary", () => {
    expect(
      calculate({
        first: 1,
        second: 2,
        third: 4,
        tolerance: 1,
        equalityWithinTolerance: false,
      }),
    ).toEqual({ sign: 1, difference: 1 });
    expect(
      tool.execute({
        first: 1,
        second: 2,
        third: 4,
        tolerance: 1,
        equalityWithinTolerance: false,
      }),
    ).toEqual({ ok: true, output: { sign: 1, difference: 1 } });
  });
});
