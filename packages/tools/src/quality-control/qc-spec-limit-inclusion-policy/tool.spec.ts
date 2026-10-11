import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("quality-control/qc-spec-limit-inclusion-policy", () => {
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
      tool.execute({
        result: 10,
        lowerLimit: 5,
        upperLimit: 10,
        includeLower: true,
        includeUpper: false,
      }),
    ).toEqual({ ok: true, output: { withinSuppliedLimits: false } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite result", (value) =>
    expect(tool.execute({ ...example.input, result: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lowerLimit", (value) =>
    expect(tool.execute({ ...example.input, lowerLimit: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite upperLimit", (value) =>
    expect(tool.execute({ ...example.input, upperLimit: value }).ok).toBe(
      false,
    ),
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        result: 5,
        lowerLimit: 5,
        upperLimit: 5,
        includeLower: true,
        includeUpper: true,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { withinSuppliedLimits: true },
    });
    expect(calculate(input)).toEqual({ withinSuppliedLimits: true });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        result: 5,
        lowerLimit: 5,
        upperLimit: 5,
        includeLower: false,
        includeUpper: true,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { withinSuppliedLimits: false },
    });
    expect(calculate(input)).toEqual({ withinSuppliedLimits: false });
  });
});
