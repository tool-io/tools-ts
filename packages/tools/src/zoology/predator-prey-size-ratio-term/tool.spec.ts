import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("zoology/predator-prey-size-ratio-term", () => {
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
        predatorLength: 60,
        preyLength: 15,
        predatorMass: 200,
        preyMass: 8,
      }),
    ).toEqual({
      ok: true,
      output: { lengthRatio: 4, massRatio: 25, preyMassFraction: 0.04 },
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
    "rejects nonfinite predatorLength",
    (value) =>
      expect(tool.execute({ ...example.input, predatorLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite preyLength", (value) =>
    expect(tool.execute({ ...example.input, preyLength: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite predatorMass",
    (value) =>
      expect(tool.execute({ ...example.input, predatorMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite preyMass", (value) =>
    expect(tool.execute({ ...example.input, preyMass: value }).ok).toBe(false),
  );
  it.each([
    { predatorLength: 0 },
    { preyLength: 0 },
    { predatorMass: 0 },
    { preyMass: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { predatorLength: 0 },
    { preyLength: 0 },
    { predatorMass: 0 },
    { preyMass: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
