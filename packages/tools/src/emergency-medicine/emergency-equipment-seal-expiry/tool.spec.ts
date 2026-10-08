import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("emergency-medicine/emergency-equipment-seal-expiry", () => {
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
        sealReference: "SEAL2",
        expiryDate: "2026-10-31",
        asOfDate: "2026-11-01",
      }),
    ).toEqual({
      ok: true,
      output: { label: "SEAL2 valid through 2026-10-31", expired: true },
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

import { SimpleToolError as Batch77DomainError } from "../../core/simple.js";
describe("batch 77 reviewed regressions", () => {
  it.each(["sealReference"])(
    "identifies an empty required text field %s",
    (field) => {
      const input = { ...example.input, [field]: "" };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field, code: "invalid_field" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch77DomainError);
    },
  );
  it.each(["2024-02-30", "2023-02-29", "2026-11-01\n", "2026-1-01"])(
    "rejects invalid expiryDate without normalization %j",
    (value) => {
      const input = { ...example.input, expiryDate: value };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field: "expiryDate", code: "invalid_domain" }],
        },
      });
      expect(() => calculate(input)).toThrowError(Batch77DomainError);
    },
  );
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
      expect(() => calculate(input)).toThrowError(Batch77DomainError);
    },
  );
});
