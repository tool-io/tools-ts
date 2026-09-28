import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-informatics/fhir-date-partial-precision-envelope", () => {
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
    expect(tool.execute({ date: "2025" })).toEqual({
      ok: true,
      output: {
        earliest: "2025-01-01",
        latest: "2025-12-31",
        precision: "year",
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

  it.each([
    { date: "2023-02-29" },
    { date: "0000" },
    { date: "2024-13" },
    { date: "2024-01-01\n" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { date: "2023-02-29" },
    { date: "0000" },
    { date: "2024-13" },
    { date: "2024-01-01\n" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 66 review regressions", () => {
  it("uses Gregorian century leap-year rules", () => {
    expect(calculate({ date: "1900-02" })).toEqual({
      earliest: "1900-02-01",
      latest: "1900-02-28",
      precision: "month",
    });
    expect(calculate({ date: "2000-02" })).toEqual({
      earliest: "2000-02-01",
      latest: "2000-02-29",
      precision: "month",
    });
  });
  it("rejects an impossible century leap day through the direct API", () => {
    expect(() => calculate({ date: "1900-02-29" })).toThrow();
  });
});
