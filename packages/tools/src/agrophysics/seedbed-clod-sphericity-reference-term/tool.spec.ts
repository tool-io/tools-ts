import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agrophysics/seedbed-clod-sphericity-reference-term", () => {
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
    expect(tool.execute({ volume: 8, measuredSurface: 24 })).toEqual({
      ok: true,
      output: {
        equivalentSphereArea: 19.343903448197636,
        sphericity: 0.8059959770082349,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite volume", (value) =>
    expect(tool.execute({ ...example.input, volume: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite measuredSurface",
    (value) =>
      expect(
        tool.execute({ ...example.input, measuredSurface: value }).ok,
      ).toBe(false),
  );
  it.each([{ volume: 0 }, { measuredSurface: 0 }])(
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
  it.each([{ volume: 0 }, { measuredSurface: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

// batch 68 regression review

it("recognizes a sphere and avoids squaring a huge volume first", () => {
  const sphere = calculate({
    volume: (4 * Math.PI) / 3,
    measuredSurface: 4 * Math.PI,
  });
  expect(sphere.sphericity).toBeCloseTo(1, 12);
  const large = calculate({ volume: 1e150, measuredSurface: 1e102 });
  expect(large.sphericity).toBeCloseTo(0.0483597586204941, 12);
  expect(Number.isFinite(large.equivalentSphereArea)).toBe(true);
});
