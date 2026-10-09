import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geojson/feature-property-null-removal-choice", () => {
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
      tool.execute({ propertiesJson: '{"a":null,"b":2}', removeNulls: false }),
    ).toEqual({
      ok: true,
      output: { propertiesJson: '{"a":null,"b":2}', removedNames: [] },
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
      ...{
        propertiesJson: '{"__proto__":null,"nested":{"a":null},"zero":0}',
        removeNulls: true,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        propertiesJson: '{"nested":{"a":null},"zero":0}',
        removedNames: ["__proto__"],
      },
    });
    expect(calculate(input)).toEqual({
      propertiesJson: '{"nested":{"a":null},"zero":0}',
      removedNames: ["__proto__"],
    });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ propertiesJson: '{"a":1e400}' } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "propertiesJson", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ propertiesJson: "null" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "propertiesJson", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ propertiesJson: "{" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "propertiesJson", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
