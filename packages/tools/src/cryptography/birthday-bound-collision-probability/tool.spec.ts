import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, birthdayBoundCollisionProbabilityInputSchema, birthdayBoundCollisionProbabilityOutputSchema } from "./index.js";
describe("cryptography/birthday-bound-collision-probability", () => {
  it("executes the canonical example through the public subpath", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.probability).toBeCloseTo(example.output.probability, 15);
      expect(matchesToolJsonSchema(result.output, birthdayBoundCollisionProbabilityOutputSchema)).toBe(true);
    }
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, birthdayBoundCollisionProbabilityInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, birthdayBoundCollisionProbabilityOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "spaceSize": 100,
  "sampleCount": 1
})).toEqual({ ok: true, output: {
  "probability": 0
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "spaceSize": 100,
  "sampleCount": 0
})).toEqual({ ok: true, output: {
  "probability": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "spaceSize", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });
  it("matches the independently calculated birthday estimate", () => {
    const result = tool.execute({ spaceSize: 365, sampleCount: 23 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.probability).toBeCloseTo(0.5000017521827107, 12);
  });
  it("reports certainty beyond the outcome count", () => {
    expect(tool.execute({ spaceSize: 2, sampleCount: 3 })).toEqual({ ok: true, output: { probability: 1 } });
  });
});
