import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("atmospheric-science/atmospheric-scale-height-ratio", () => {
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
        firstTemperature: 250,
        secondTemperature: 250,
        firstMolarMass: 20,
        secondMolarMass: 40,
        firstGravity: 10,
        secondGravity: 10,
      }),
    ).toEqual({ ok: true, output: { ratio: 2 } });
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
    "rejects nonfinite firstTemperature",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstTemperature: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondTemperature",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondTemperature: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstMolarMass",
    (value) =>
      expect(tool.execute({ ...example.input, firstMolarMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondMolarMass",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondMolarMass: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstGravity",
    (value) =>
      expect(tool.execute({ ...example.input, firstGravity: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondGravity",
    (value) =>
      expect(tool.execute({ ...example.input, secondGravity: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { firstTemperature: 0 },
    { secondTemperature: 0 },
    { firstMolarMass: 0 },
    { secondMolarMass: 0 },
    { firstGravity: 0 },
    { secondGravity: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstTemperature: 0 },
    { secondTemperature: 0 },
    { firstMolarMass: 0 },
    { secondMolarMass: 0 },
    { firstGravity: 0 },
    { secondGravity: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
