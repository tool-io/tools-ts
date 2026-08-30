import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, certificateValidityWindowDaysLeftInputSchema, certificateValidityWindowDaysLeftOutputSchema } from "./index.js";
describe("cryptography/certificate-validity-window-days-left", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, certificateValidityWindowDaysLeftInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, certificateValidityWindowDaysLeftOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "notBefore": 86400000,
  "notAfter": 259200000,
  "now": 0
})).toEqual({ ok: true, output: {
  "status": "not-yet-valid",
  "daysLeft": 3
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "notBefore": 0,
  "notAfter": 0,
  "now": 0
})).toEqual({ ok: true, output: {
  "status": "valid",
  "daysLeft": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "notBefore", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("includes notAfter while rejecting reversed windows", () => {
    expect(tool.execute({ notBefore: 0, notAfter: 86400000, now: 86400000 })).toEqual({ ok: true, output: { status: "valid", daysLeft: 0 } });
    expect(tool.execute({ notBefore: 86400000, notAfter: 0, now: 0 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "notAfter", code: "reversed_interval" }] } });
  });
});
