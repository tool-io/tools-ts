import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geomorphology/grain-size-phi-step", () => {
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
    expect(tool.execute({ firstDiameter: 1, secondDiameter: 4 })).toEqual({
      ok: true,
      output: { phiDifference: -2 },
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
    "rejects nonfinite firstDiameter",
    (value) =>
      expect(tool.execute({ ...example.input, firstDiameter: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondDiameter",
    (value) =>
      expect(tool.execute({ ...example.input, secondDiameter: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ firstDiameter: 0 }, { secondDiameter: 0 }])(
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
  it.each([{ firstDiameter: 0 }, { secondDiameter: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("retains a one-ulp positive diameter difference", () => {
    const output = calculate({
      firstDiameter: 1.0000000000000002,
      secondDiameter: 1,
    });
    expect(output).toMatchObject({});
    expect(output.phiDifference).toBeCloseTo(3.203426503814917e-16, 30);
    expect(
      tool.execute({ firstDiameter: 1.0000000000000002, secondDiameter: 1 }),
    ).toEqual({ ok: true, output });
  });
  it("handles ratios outside finite Number range", () => {
    const output = calculate({ firstDiameter: 1e300, secondDiameter: 1e-300 });
    expect(output).toMatchObject({});
    expect(output.phiDifference).toBeCloseTo(1993.1568569324174, 10);
    expect(
      tool.execute({ firstDiameter: 1e300, secondDiameter: 1e-300 }),
    ).toEqual({ ok: true, output });
  });
});
