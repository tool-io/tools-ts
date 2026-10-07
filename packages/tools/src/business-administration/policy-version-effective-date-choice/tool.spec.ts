import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("business-administration/policy-version-effective-date-choice", () => {
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
        versionCodes: ["v1"],
        effectiveDates: ["2027-01-01"],
        asOfDate: "2026-11-01",
      }),
    ).toEqual({
      ok: true,
      output: { found: false, versionCode: "", effectiveDate: "" },
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
});

import { SimpleToolError as Batch76DomainError } from "../../core/simple.js";
describe("batch 76 reviewed regressions", () => {
  it.each(["2024-02-30", "2023-02-29", "2026-11-01\n", "2026-1-01"])(
    "rejects invalid asOfDate without normalization %j",
    (value) => {
      const input = { ...example.input, asOfDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "asOfDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch76DomainError);
    },
  );
  it("rejects an impossible array date with its own field", () => {
    expect(
      tool.execute({
        ...example.input,
        effectiveDates: ["2026-02-30", "2026-10-01"],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "effectiveDates", code: "invalid_domain" }] },
    });
  });
  it("selects the latest eligible date regardless of input order", () => {
    expect(
      calculate({
        versionCodes: ["new", "old", "future"],
        effectiveDates: ["2026-10-01", "2025-01-01", "2027-01-01"],
        asOfDate: "2026-11-01",
      }),
    ).toEqual({ found: true, versionCode: "new", effectiveDate: "2026-10-01" });
  });
});
