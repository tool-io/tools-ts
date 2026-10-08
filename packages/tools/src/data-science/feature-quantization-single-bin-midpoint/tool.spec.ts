import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("data-science/feature-quantization-single-bin-midpoint", () => {
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
    expect(tool.execute({ lowerEdge: -4, upperEdge: 2 })).toEqual({
      ok: true,
      output: { midpoint: -1 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lowerEdge", (value) =>
    expect(tool.execute({ ...example.input, lowerEdge: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite upperEdge", (value) =>
    expect(tool.execute({ ...example.input, upperEdge: value }).ok).toBe(false),
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ lowerEdge: 1e308, upperEdge: 1e308 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { midpoint: 1e308 },
    });
    expect(calculate(input)).toEqual({ midpoint: 1e308 });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ lowerEdge: 5, upperEdge: 4 } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "upperEdge", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
