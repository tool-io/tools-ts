import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, bruteForceTimeEstimateAtHashesPerSecondInputSchema, bruteForceTimeEstimateAtHashesPerSecondOutputSchema } from "./index.js";
describe("cryptography/brute-force-time-estimate-at-hashes-per-second", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, bruteForceTimeEstimateAtHashesPerSecondInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, bruteForceTimeEstimateAtHashesPerSecondOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "keyspace": 3,
  "guessesPerSecond": 1
})).toEqual({ ok: true, output: {
  "exhaustiveSeconds": 3,
  "averageSeconds": 2
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "keyspace": 1,
  "guessesPerSecond": 2
})).toEqual({ ok: true, output: {
  "exhaustiveSeconds": 0.5,
  "averageSeconds": 0.5
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "keyspace", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("rejects fractional and inexact keyspace counts", () => {
    for (const keyspace of [1.5, Number.MAX_SAFE_INTEGER + 1])
      expect(tool.execute({ ...example.input, keyspace })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "keyspace", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, guessesPerSecond: Number.MIN_VALUE })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "guessesPerSecond", code: "numeric_overflow" }] } });
  });
});
