import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geophysics/seismic-trace-rms-one-window-term", () => {
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
    expect(tool.execute({ samples: [2, 4], removeMean: true })).toEqual({
      ok: true,
      output: { mean: 3, rms: 1 },
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

  it.each([{ samples: [] }])(
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
  it.each([{ samples: [] }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 66 review regressions", () => {
  it("handles an all-zero window explicitly", () => {
    expect(calculate({ samples: [0, 0, 0], removeMean: true })).toEqual({
      mean: 0,
      rms: 0,
    });
  });
  it("demeans a large constant without overflowing the sum", () => {
    expect(calculate({ samples: [1e308, 1e308], removeMean: true })).toEqual({
      mean: 1e308,
      rms: 0,
    });
  });
  it("computes a finite centered RMS across opposite extremes", () => {
    const r = calculate({ samples: [-1e308, 1e308, 1e308], removeMean: true });
    expect(r.mean / 1e308).toBeCloseTo(1 / 3, 14);
    expect(r.rms / 1e308).toBeCloseTo(0.9428090415820634, 14);
  });
});
