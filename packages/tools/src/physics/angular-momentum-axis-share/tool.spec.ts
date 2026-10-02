import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("physics/angular-momentum-axis-share", () => {
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
      tool.execute({ angularMomentum: [0, 0, 0], axis: [0, 1, 0] }),
    ).toEqual({
      ok: true,
      output: { projection: 0, magnitude: 0, signedShare: 0, defined: false },
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

describe("nested finite angularMomentum validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, angularMomentum: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "angularMomentum" }],
        },
      });
    },
  );
});

describe("nested finite axis validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, axis: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "axis" }],
        },
      });
    },
  );
});

describe("independently reviewed regressions", () => {
  it("huge supplied axis coordinates do not destroy a finite projection", () => {
    const output = calculate({
      angularMomentum: [1, 1, 0],
      axis: [1e308, 1e308, 0],
    });
    expect(output).toMatchObject({});
    expect(output.projection).toBeCloseTo(1.4142135623730951, 14);
    expect(output.magnitude).toBeCloseTo(1.4142135623730951, 14);
    expect(output.signedShare).toBeCloseTo(1, 14);
    expect(
      tool.execute({ angularMomentum: [1, 1, 0], axis: [1e308, 1e308, 0] }),
    ).toEqual({ ok: true, output });
  });
});
