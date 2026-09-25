import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("demographic-economics/migration-cohort-balance-gap", () => {
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
        start: 100,
        arrivals: 10,
        departures: 20,
        observedEnd: 90,
      }),
    ).toEqual({
      ok: true,
      output: { expectedEndDecimal: "90", residualDecimal: "0" },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite start", (value) =>
    expect(tool.execute({ ...example.input, start: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite arrivals", (value) =>
    expect(tool.execute({ ...example.input, arrivals: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite departures", (value) =>
    expect(tool.execute({ ...example.input, departures: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observedEnd",
    (value) =>
      expect(tool.execute({ ...example.input, observedEnd: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { start: -1 },
    { arrivals: -1 },
    { departures: -1 },
    { observedEnd: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { start: -1 },
    { arrivals: -1 },
    { departures: -1 },
    { observedEnd: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 72 independent regressions", () => {
  it("keeps a one-person residual above the safe integer range", () => {
    const input = {
      start: 9007199254740991,
      arrivals: 2,
      departures: 1,
      observedEnd: 9007199254740991,
    };
    expect(calculate(input)).toEqual({
      expectedEndDecimal: "9007199254740992",
      residualDecimal: "-1",
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { expectedEndDecimal: "9007199254740992", residualDecimal: "-1" },
    });
  });
});
