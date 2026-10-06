import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("adult-education/prior-learning-evidence-expiry", () => {
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
        evidenceDate: "2026-10-01",
        validForDays: 10,
        assessmentDate: "2026-10-12",
      }),
    ).toEqual({
      ok: true,
      output: { ageDays: 11, remainingDays: -1, withinSuppliedWindow: false },
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
    "rejects nonfinite validForDays",
    (value) =>
      expect(tool.execute({ ...example.input, validForDays: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ validForDays: -1 }])(
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
  it.each([{ validForDays: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

import { SimpleToolError as Batch76DomainError } from "../../core/simple.js";
describe("batch 76 reviewed regressions", () => {
  it.each(["2024-02-30", "2023-02-29", "2026-11-01\n", "2026-1-01"])(
    "rejects invalid assessmentDate without normalization %j",
    (value) => {
      const input = { ...example.input, assessmentDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "assessmentDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch76DomainError);
    },
  );
  it.each(["2024-02-30", "2023-02-29", "2026-11-01\n", "2026-1-01"])(
    "rejects invalid evidenceDate without normalization %j",
    (value) => {
      const input = { ...example.input, evidenceDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "evidenceDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch76DomainError);
    },
  );
});
