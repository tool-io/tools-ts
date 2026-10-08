import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("data-science/target-label-availability-date-flag", () => {
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
        labelAvailableDate: "2026-11-01",
        trainingCutoffDate: "2026-11-01",
        cutoffInclusive: false,
      }),
    ).toEqual({ ok: true, output: { availableByCutoff: false } });
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
});

import { SimpleToolError as Batch76DomainError } from "../../core/simple.js";
describe("batch 76 reviewed regressions", () => {
  it.each(["2024-02-30", "2023-02-29", "2026-11-01\n", "2026-1-01"])(
    "rejects invalid labelAvailableDate without normalization %j",
    (value) => {
      const input = { ...example.input, labelAvailableDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "labelAvailableDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch76DomainError);
    },
  );
  it.each(["2024-02-30", "2023-02-29", "2026-11-01\n", "2026-1-01"])(
    "rejects invalid trainingCutoffDate without normalization %j",
    (value) => {
      const input = { ...example.input, trainingCutoffDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "trainingCutoffDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch76DomainError);
    },
  );
  it("includes equality only when explicitly requested", () => {
    expect(
      calculate({
        labelAvailableDate: "2026-11-01",
        trainingCutoffDate: "2026-11-01",
        cutoffInclusive: true,
      }),
    ).toEqual({ availableByCutoff: true });
  });
});
