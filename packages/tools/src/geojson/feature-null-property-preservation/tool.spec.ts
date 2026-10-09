import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geojson/feature-null-property-preservation", () => {
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
        featureId: "F18",
        propertyName: "note",
        preserveNull: false,
      }),
    ).toEqual({
      ok: true,
      output: {
        featureJson:
          '{"type":"Feature","id":"F18","geometry":null,"properties":{}}',
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

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ featureId: "F17", propertyName: "", preserveNull: true },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        featureJson:
          '{"type":"Feature","id":"F17","geometry":null,"properties":{"":null}}',
      },
    });
    expect(calculate(input)).toEqual({
      featureJson:
        '{"type":"Feature","id":"F17","geometry":null,"properties":{"":null}}',
    });
  });
});
