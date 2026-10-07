import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biomechanics/force-plate-shear-resultant-angle", () => {
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
    expect(tool.execute({ forceX: 1, forceY: 0 })).toEqual({
      ok: true,
      output: { shearMagnitude: 1, angleRadians: 0 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite forceX", (value) =>
    expect(tool.execute({ ...example.input, forceX: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite forceY", (value) =>
    expect(tool.execute({ ...example.input, forceY: value }).ok).toBe(false),
  );
});

describe("reviewed boundary cases", () => {
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ forceX: 0, forceY: 0 } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "forceX", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
