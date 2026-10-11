import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacogenomics/star-allele-token-parser", () => {
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
    expect(tool.execute({ alleleToken: "*2" })).toEqual({
      ok: true,
      output: { alleleNumberText: "2", suballeleText: "" },
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

describe("reviewed boundary cases", () => {
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ alleleToken: "*04" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "alleleToken", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ alleleToken: "*4.001\n" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "alleleToken", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ alleleToken: "*4x2" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "alleleToken", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ alleleToken: "*10000000000000000.007" },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { alleleNumberText: "10000000000000000", suballeleText: "007" },
    });
    expect(calculate(input)).toEqual({
      alleleNumberText: "10000000000000000",
      suballeleText: "007",
    });
  });
});
