import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("epidemiology/epidemic-curve-bin-date", () => {
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
        eventDate: "2025-12-31",
        originDate: "2026-01-01",
        binWidthDays: 7,
      }),
    ).toEqual({
      ok: true,
      output: { binIndex: -1, binStartDate: "2025-12-25" },
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
    "rejects nonfinite binWidthDays",
    (value) =>
      expect(tool.execute({ ...example.input, binWidthDays: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ binWidthDays: 0 }, { binWidthDays: 3652426 }])(
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
  it.each([{ binWidthDays: 0 }, { binWidthDays: 3652426 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

import { SimpleToolError as Batch77DomainError } from "../../core/simple.js";
describe("batch 77 reviewed regressions", () => {
  it.each(["2024-02-30", "2023-02-29", "2026-11-01\n", "2026-1-01"])(
    "rejects invalid eventDate without normalization %j",
    (value) => {
      const input = { ...example.input, eventDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "eventDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch77DomainError);
    },
  );
  it.each(["2024-02-30", "2023-02-29", "2026-11-01\n", "2026-1-01"])(
    "rejects invalid originDate without normalization %j",
    (value) => {
      const input = { ...example.input, originDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "originDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch77DomainError);
    },
  );
  it("uses floor for dates before the origin", () => {
    expect(
      calculate({
        eventDate: "2025-12-31",
        originDate: "2026-01-01",
        binWidthDays: 7,
      }),
    ).toEqual({ binIndex: -1, binStartDate: "2025-12-25" });
  });
  it("keeps an origin year below 100 intact", () => {
    expect(
      calculate({
        eventDate: "0099-01-02",
        originDate: "0099-01-01",
        binWidthDays: 1,
      }),
    ).toEqual({ binIndex: 1, binStartDate: "0099-01-02" });
  });
});
