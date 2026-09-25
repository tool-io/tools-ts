import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("ecology/ecological-stoichiometry-cnp-molar-factor", () => {
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
        carbonMass: 60,
        nitrogenMass: 14,
        phosphorusMass: 15.5,
        carbonMolarMass: 12,
        nitrogenMolarMass: 14,
        phosphorusMolarMass: 31,
      }),
    ).toEqual({
      ok: true,
      output: {
        carbonMoles: 5,
        nitrogenMoles: 1,
        phosphorusMoles: 0.5,
        carbonPerPhosphorus: 10,
        nitrogenPerPhosphorus: 2,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite carbonMass", (value) =>
    expect(tool.execute({ ...example.input, carbonMass: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite nitrogenMass",
    (value) =>
      expect(tool.execute({ ...example.input, nitrogenMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite phosphorusMass",
    (value) =>
      expect(tool.execute({ ...example.input, phosphorusMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite carbonMolarMass",
    (value) =>
      expect(
        tool.execute({ ...example.input, carbonMolarMass: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite nitrogenMolarMass",
    (value) =>
      expect(
        tool.execute({ ...example.input, nitrogenMolarMass: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite phosphorusMolarMass",
    (value) =>
      expect(
        tool.execute({ ...example.input, phosphorusMolarMass: value }).ok,
      ).toBe(false),
  );
  it.each([
    { carbonMass: -1 },
    { nitrogenMass: -1 },
    { phosphorusMass: 0 },
    { carbonMolarMass: 0 },
    { nitrogenMolarMass: 0 },
    { phosphorusMolarMass: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { carbonMass: -1 },
    { nitrogenMass: -1 },
    { phosphorusMass: 0 },
    { carbonMolarMass: 0 },
    { nitrogenMolarMass: 0 },
    { phosphorusMolarMass: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
