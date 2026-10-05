import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geometry/sphere-chord-midpoint-depth", () => {
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
    expect(tool.execute({ sphereRadius: 5, chordLength: 0 })).toEqual({
      ok: true,
      output: { depthFromSurface: 0 },
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite chordLength",
    (value) =>
      expect(tool.execute({ ...example.input, chordLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ sphereRadius: 0 }, { chordLength: -1 }])(
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
  it.each([{ sphereRadius: 0 }, { chordLength: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

// batch75 review regressions
it("handles diameter, tiny chords and large finite radii", () => {
  expect(calculate({ sphereRadius: 5, chordLength: 10 })).toEqual({
    depthFromSurface: 5,
  });
  expect(
    calculate({ sphereRadius: 1, chordLength: 2e-8 }).depthFromSurface,
  ).toBeCloseTo(5e-17, 30);
  expect(
    calculate({ sphereRadius: 1e308, chordLength: 1e308 }).depthFromSurface /
      1e308,
  ).toBeCloseTo(0.13397459621556135, 14);
});
