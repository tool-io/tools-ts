import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("atmospheric-science/pressure-level-log-interpolation-weight", () => {
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
        pressure: 1000,
        firstPressure: 1000,
        secondPressure: 500,
      }),
    ).toEqual({ ok: true, output: { secondLevelWeight: 0 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite pressure", (value) =>
    expect(tool.execute({ ...example.input, pressure: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstPressure",
    (value) =>
      expect(tool.execute({ ...example.input, firstPressure: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondPressure",
    (value) =>
      expect(tool.execute({ ...example.input, secondPressure: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ pressure: 0 }, { firstPressure: 0 }, { secondPressure: 0 }])(
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
  it.each([{ pressure: 0 }, { firstPressure: 0 }, { secondPressure: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        pressure: 1.0000000000000002e300,
        firstPressure: 1e300,
        secondPressure: 1.0000000000000002e300,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { secondLevelWeight: 1 },
    });
    expect(calculate(input)).toEqual({ secondLevelWeight: 1 });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ pressure: 5e-324, firstPressure: 1, secondPressure: 5e-324 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { secondLevelWeight: 1 },
    });
    expect(calculate(input)).toEqual({ secondLevelWeight: 1 });
  });
});
