import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, indexOfCoincidenceCalculatorInputSchema, indexOfCoincidenceCalculatorOutputSchema } from "./index.js";
describe("cryptography/index-of-coincidence-calculator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, indexOfCoincidenceCalculatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, indexOfCoincidenceCalculatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "text": "ABCD"
})).toEqual({ ok: true, output: {
  "index": 0,
  "letterCount": 4
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "text": "aa!"
})).toEqual({ ok: true, output: {
  "index": 1,
  "letterCount": 2
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "text": "A!"
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "insufficient_letters" }] } });
  });

  it("filters before Unicode case expansion", () => {
    expect(tool.execute({ text: "AßBſ" })).toEqual({ ok: true, output: { index: 0, letterCount: 2 } });
    expect(tool.execute({ text: "ßſ" })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "insufficient_letters" }] } });
  });
});
