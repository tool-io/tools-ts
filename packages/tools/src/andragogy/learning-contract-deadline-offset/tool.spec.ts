import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("andragogy/learning-contract-deadline-offset", () => {
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
    expect(tool.execute({ startDate: "2024-02-28", offsetDays: 1 })).toEqual({
      ok: true,
      output: { deadlineDate: "2024-02-29" },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite offsetDays", (value) =>
    expect(tool.execute({ ...example.input, offsetDays: value }).ok).toBe(
      false,
    ),
  );
  it.each([{ offsetDays: -1 }, { offsetDays: 3652425 }])(
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
  it.each([{ offsetDays: -1 }, { offsetDays: 3652425 }])(
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
    "rejects invalid startDate without normalization %j",
    (value) => {
      const input = { ...example.input, startDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "startDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch76DomainError);
    },
  );
  it("crosses a leap day using UTC calendar days", () => {
    expect(calculate({ startDate: "2024-02-28", offsetDays: 2 })).toEqual({
      deadlineDate: "2024-03-01",
    });
  });
  it("accepts representable offsets beyond the former convenience limit", () => {
    expect(calculate({ startDate: "0000-01-01", offsetDays: 146097 })).toEqual({
      deadlineDate: "0400-01-01",
    });
  });
  it("attributes a date-range overflow to the offset", () => {
    expect(
      tool.execute({ startDate: "9999-12-31", offsetDays: 1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "offsetDays", code: "invalid_domain" }] },
    });
  });
});
