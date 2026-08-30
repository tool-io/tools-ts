import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, timeBasedTotpStepRemainingSecondsInputSchema, timeBasedTotpStepRemainingSecondsOutputSchema } from "./index.js";
describe("cryptography/time-based-totp-step-remaining-seconds", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, timeBasedTotpStepRemainingSecondsInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, timeBasedTotpStepRemainingSecondsOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "now": 60,
  "epoch": 0,
  "step": 30
})).toEqual({ ok: true, output: {
  "counter": "2",
  "remainingSeconds": 30
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "now": 0,
  "epoch": 0,
  "step": 30
})).toEqual({ ok: true, output: {
  "counter": "0",
  "remainingSeconds": 30
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "now", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "now": 0,
  "epoch": 1,
  "step": 30
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "now", code: "before_epoch" }] } });
  });

});
