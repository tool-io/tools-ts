import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bioengineering/sensor-bridge-imbalance-voltage", () => {
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
    expect(tool.execute({ supply: 10, r1: 2, r2: 2, r3: 2, r4: 2 })).toEqual({
      ok: true,
      output: { outputVoltage: 0 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite supply", (value) =>
    expect(tool.execute({ ...example.input, supply: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite r1", (value) =>
    expect(tool.execute({ ...example.input, r1: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite r2", (value) =>
    expect(tool.execute({ ...example.input, r2: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite r3", (value) =>
    expect(tool.execute({ ...example.input, r3: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite r4", (value) =>
    expect(tool.execute({ ...example.input, r4: value }).ok).toBe(false),
  );
  it.each([{ r1: 0 }, { r2: 0 }, { r3: 0 }, { r4: 0 }])(
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
  it.each([{ r1: 0 }, { r2: 0 }, { r3: 0 }, { r4: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 72 independent regressions", () => {
  it("reverses voltage when the bridge midpoint order swaps", () => {
    const a = calculate({ supply: 10, r1: 1, r2: 3, r3: 2, r4: 2 }),
      b = calculate({ supply: 10, r1: 2, r2: 2, r3: 1, r4: 3 });
    expect(a.outputVoltage).toBe(2.5);
    expect(b.outputVoltage).toBe(-2.5);
  });
});
