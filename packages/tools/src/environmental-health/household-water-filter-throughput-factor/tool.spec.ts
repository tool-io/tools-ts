import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-health/household-water-filter-throughput-factor", () => {
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
        flowPerMinute: 3,
        minutes: 5,
        bypassFraction: 0,
        ratedVolume: 60,
        priorVolume: 50,
      }),
    ).toEqual({
      ok: true,
      output: { totalVolume: 15, filteredVolume: 15, remainingRatedVolume: -5 },
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
    "rejects nonfinite flowPerMinute",
    (value) =>
      expect(tool.execute({ ...example.input, flowPerMinute: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite minutes", (value) =>
    expect(tool.execute({ ...example.input, minutes: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite bypassFraction",
    (value) =>
      expect(tool.execute({ ...example.input, bypassFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite ratedVolume",
    (value) =>
      expect(tool.execute({ ...example.input, ratedVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite priorVolume",
    (value) =>
      expect(tool.execute({ ...example.input, priorVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { flowPerMinute: -1 },
    { minutes: -1 },
    { bypassFraction: -1 },
    { bypassFraction: 2 },
    { ratedVolume: -1 },
    { priorVolume: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { flowPerMinute: -1 },
    { minutes: -1 },
    { bypassFraction: -1 },
    { bypassFraction: 2 },
    { ratedVolume: -1 },
    { priorVolume: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
