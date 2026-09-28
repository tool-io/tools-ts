import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geometry/ellipse-focal-distance-residual", () => {
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
      tool.execute({ semimajor: 5, semiminor: 5, suppliedFocusDistance: 0 }),
    ).toEqual({ ok: true, output: { derivedFocusDistance: 0, residual: 0 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite semimajor", (value) =>
    expect(tool.execute({ ...example.input, semimajor: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite semiminor", (value) =>
    expect(tool.execute({ ...example.input, semiminor: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedFocusDistance",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedFocusDistance: value }).ok,
      ).toBe(false),
  );
  it.each([{ semiminor: -1 }])(
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
  it.each([{ semiminor: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 72 numerical range regressions", () => {
  it("keeps a huge circle focus at the center", () => {
    const input = {
      semimajor: 1e308,
      semiminor: 1e308,
      suppliedFocusDistance: 0,
    };
    expect(calculate(input)).toEqual({ derivedFocusDistance: 0, residual: 0 });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { derivedFocusDistance: 0, residual: 0 },
    });
  });
  it("handles a huge degenerate minor axis", () => {
    const input = {
      semimajor: 1e308,
      semiminor: 0,
      suppliedFocusDistance: 1e308,
    };
    expect(calculate(input)).toEqual({
      derivedFocusDistance: 1e308,
      residual: 0,
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { derivedFocusDistance: 1e308, residual: 0 },
    });
  });
});
