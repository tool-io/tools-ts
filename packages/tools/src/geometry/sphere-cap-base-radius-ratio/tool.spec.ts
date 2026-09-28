import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geometry/sphere-cap-base-radius-ratio", () => {
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
    expect(tool.execute({ sphereRadius: 5, capHeight: 5 })).toEqual({
      ok: true,
      output: { baseRadius: 5, radiusRatio: 1 },
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
    "rejects nonfinite sphereRadius",
    (value) =>
      expect(tool.execute({ ...example.input, sphereRadius: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite capHeight", (value) =>
    expect(tool.execute({ ...example.input, capHeight: value }).ok).toBe(false),
  );
  it.each([{ sphereRadius: 0 }, { capHeight: -1 }])(
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
  it.each([{ sphereRadius: 0 }, { capHeight: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 72 numerical range regressions", () => {
  it("preserves the equatorial radius when twice the sphere radius overflows", () => {
    const input = { sphereRadius: 1e308, capHeight: 1e308 };
    const output = calculate(input);
    expect(output.baseRadius / 1e308).toBeCloseTo(1, 14);
    expect(output.radiusRatio).toBeCloseTo(1, 14);
    expect(tool.execute(input)).toEqual({ ok: true, output });
  });
  it("keeps a finite tiny cap on a huge sphere", () => {
    const input = { sphereRadius: 1e308, capHeight: Number.MIN_VALUE };
    const output = calculate(input);
    expect(output.baseRadius / 1e-8).toBeCloseTo(3.143455569405257, 13);
    expect(tool.execute(input)).toEqual({ ok: true, output });
  });
  it("keeps the zero-height cap well defined", () => {
    expect(calculate({ sphereRadius: 1e308, capHeight: 0 })).toEqual({
      baseRadius: 0,
      radiusRatio: 0,
    });
  });
});
