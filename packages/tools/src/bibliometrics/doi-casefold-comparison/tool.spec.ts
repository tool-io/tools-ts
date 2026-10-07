import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bibliometrics/doi-casefold-comparison", () => {
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
      tool.execute({ firstDoi: "10.1234/a", secondDoi: "10.1234/b" }),
    ).toEqual({
      ok: true,
      output: {
        sameName: false,
        firstNormalized: "10.1234/a",
        secondNormalized: "10.1234/b",
      },
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

describe("batch 76 reviewed regressions", () => {
  it("does not silently trim an invalid DOI newline", () => {
    expect(
      tool.execute({ ...example.input, firstDoi: "10.1000/ABC\n" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "firstDoi", code: "invalid_domain" }] },
    });
  });
});
