import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, jwtExpClaimDaysLeftConverterInputSchema, jwtExpClaimDaysLeftConverterOutputSchema } from "./index.js";
describe("cryptography/jwt-exp-claim-days-left-converter", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, jwtExpClaimDaysLeftConverterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, jwtExpClaimDaysLeftConverterOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "expiration": 0,
  "now": 86400
})).toEqual({ ok: true, output: {
  "daysLeft": -1,
  "expired": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "expiration": 10.5,
  "now": 10.5
})).toEqual({ ok: true, output: {
  "daysLeft": 0,
  "expired": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "expiration", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("supports large finite NumericDate differences without intermediate overflow", () => {
    const result = tool.execute({ expiration: Number.MAX_VALUE, now: -Number.MAX_VALUE });
    expect(result.ok).toBe(true);
    if (result.ok) { expect(Number.isFinite(result.output.daysLeft)).toBe(true); expect(result.output.expired).toBe(false); }
  });
});
