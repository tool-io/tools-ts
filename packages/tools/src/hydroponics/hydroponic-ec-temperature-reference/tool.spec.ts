import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("hydroponics/hydroponic-ec-temperature-reference", () => {
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
        readingId: "R18",
        conductivityUnit: "uS/cm",
        suppliedReferenceTemperatureText: "20 C",
      }),
    ).toEqual({ ok: true, output: { token: '["R18","uS/cm","20 C"]' } });
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
  it.each([
    "readingId",
    "conductivityUnit",
    "suppliedReferenceTemperatureText",
  ])("rejects empty required text with its field", (field) => {
    const result = tool.execute({ ...example.input, [field]: "" });
    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field, code: "invalid_field" }],
      },
    });
  });
});
