import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, keyspaceSizeCalculatorInputSchema, keyspaceSizeCalculatorOutputSchema } from "./index.js";
describe("cryptography/keyspace-size-calculator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, keyspaceSizeCalculatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, keyspaceSizeCalculatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "alphabetSize": 2,
  "length": 10
})).toEqual({ ok: true, output: {
  "keyspace": "1024"
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "alphabetSize": 1,
  "length": 10000
})).toEqual({ ok: true, output: {
  "keyspace": "1"
} });
    expect(tool.execute({
  "alphabetSize": 10,
  "length": 0
})).toEqual({ ok: true, output: {
  "keyspace": "1"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "alphabetSize", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
