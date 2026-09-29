import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("industrial-engineering/oee-availability-performance-quality-one-factor", () => {
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
        plannedMinutes: 400,
        runMinutes: 300,
        totalUnits: 600,
        goodUnits: 540,
        idealCycleMinutes: 0.4,
      }),
    ).toEqual({
      ok: true,
      output: { availability: 0.75, performance: 0.8, quality: 0.9, oee: 0.54 },
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
    "rejects nonfinite plannedMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, plannedMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite runMinutes", (value) =>
    expect(tool.execute({ ...example.input, runMinutes: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite totalUnits", (value) =>
    expect(tool.execute({ ...example.input, totalUnits: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite goodUnits", (value) =>
    expect(tool.execute({ ...example.input, goodUnits: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite idealCycleMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, idealCycleMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([
    { plannedMinutes: 0 },
    { runMinutes: 0 },
    { totalUnits: 0 },
    { goodUnits: -1 },
    { idealCycleMinutes: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { plannedMinutes: 0 },
    { runMinutes: 0 },
    { totalUnits: 0 },
    { goodUnits: -1 },
    { idealCycleMinutes: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
