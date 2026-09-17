import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import { SimpleToolError } from "../../core/simple.js";
import tool, {
  calculateHzPoeOptimisticLuminosityScaling,
  example,
  hzPoeOptimisticLuminosityScalingTool,
  runHzPoeOptimisticLuminosityScaling,
} from "./index.js";

describe("astrobiology/hz-poe-optimistic-luminosity-scaling", () => {
  it("exports its definition, calculation, runner, and canonical example", () => {
    expect(tool).toBe(hzPoeOptimisticLuminosityScalingTool);
    expect(tool.id).toBe("astrobiology/hz-poe-optimistic-luminosity-scaling");
    expect(runHzPoeOptimisticLuminosityScaling).toBe(tool.execute);
    expect(calculateHzPoeOptimisticLuminosityScaling(example.input)).toEqual(
      example.output,
    );
    expect(runHzPoeOptimisticLuminosityScaling(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });

  it.each([
    [1, { innerAu: 0.75, outerAu: 1.77, widthAu: 1.02 }],
    [0.25, { innerAu: 0.375, outerAu: 0.885, widthAu: 0.51 }],
  ])(
    "reproduces the POE reference scaling at L = %s",
    (luminositySolar, output) => {
      expect(
        calculateHzPoeOptimisticLuminosityScaling({ luminositySolar }),
      ).toEqual(output);
      expect(tool.execute({ luminositySolar })).toEqual({ ok: true, output });
    },
  );

  it("preserves precision for a non-square luminosity", () => {
    const output = calculateHzPoeOptimisticLuminosityScaling({
      luminositySolar: 2,
    });
    expect(output.innerAu).toBeCloseTo(1.0606601717798214, 14);
    expect(output.outerAu).toBeCloseTo(2.5031580054003784, 14);
    expect(output.widthAu).toBeCloseTo(1.442497833620557, 14);
    expect(output.widthAu).toBeCloseTo(output.outerAu - output.innerAu, 14);
  });

  it.each([Number.MIN_VALUE, Number.MAX_VALUE])(
    "supports a positive finite luminosity at the numeric boundary %s",
    (luminositySolar) => {
      const input = Object.freeze({ luminositySolar });
      const output = calculateHzPoeOptimisticLuminosityScaling(input);
      for (const value of Object.values(output)) {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThan(0);
      }
      expect(output.outerAu).toBeGreaterThan(output.innerAu);
      expect(output.outerAu / output.innerAu).toBeCloseTo(2.36, 14);
      expect(output.widthAu / output.innerAu).toBeCloseTo(1.36, 14);
      expect(tool.execute(input)).toEqual({ ok: true, output });
      expect(matchesToolJsonSchema(input, tool.inputSchema)).toBe(true);
      expect(matchesToolJsonSchema(output, tool.outputSchema)).toBe(true);
      expect(input.luminositySolar).toBe(luminositySolar);
    },
  );

  it.each([0, -0, -1, Number.NaN, Infinity, -Infinity])(
    "rejects %s in both the runtime and the direct calculation",
    (luminositySolar) => {
      expect(tool.execute({ luminositySolar })).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "luminositySolar" }],
        },
      });
      expect(matchesToolJsonSchema({ luminositySolar }, tool.inputSchema)).toBe(
        false,
      );
      expect(() =>
        calculateHzPoeOptimisticLuminosityScaling({ luminositySolar }),
      ).toThrowError(SimpleToolError);
      expect(() =>
        calculateHzPoeOptimisticLuminosityScaling({ luminositySolar }),
      ).toThrowError(
        expect.objectContaining({
          code: "invalid_luminosity",
          field: "luminositySolar",
        }),
      );
    },
  );

  it.each([undefined, null, "4", "", true, [], {}, new Number(4)])(
    "rejects missing or nonnumeric luminosity without coercion: %s",
    (luminositySolar) => {
      expect(tool.execute({ luminositySolar })).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "luminositySolar" }],
        },
      });
    },
  );

  it.each([null, undefined, 4, "4", []])(
    "rejects a non-object input: %s",
    (input) => {
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "object_required", field: "" }],
        },
      });
    },
  );

  it("rejects an absent or inherited luminosity field", () => {
    for (const input of [{}, Object.create({ luminositySolar: 4 })])
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "luminositySolar" }],
        },
      });
  });

  it.each(["temperatureK", "callerRecentVenusFlux", "extra"])(
    "rejects the undeclared input %s rather than changing conventions",
    (field) => {
      const input = { luminositySolar: 4, [field]: 1 };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "unknown_field", field }],
        },
      });
      expect(matchesToolJsonSchema(input, tool.inputSchema)).toBe(false);
    },
  );

  it("publishes a pure contract with one solar-unit input and three AU outputs", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(tool.execution).toEqual({ kind: "pure" });
    expect(tool.inputSchema.required).toEqual(["luminositySolar"]);
    expect(tool.outputSchema.required).toEqual([
      "innerAu",
      "outerAu",
      "widthAu",
    ]);
    expect(tool.ports.inputs).toMatchObject([
      { id: "luminositySolar", required: true, valueType: { unit: "L_sun" } },
    ]);
    expect(tool.ports.outputs).toMatchObject([
      { id: "innerAu", valueType: { type: "number", unit: "AU" } },
      { id: "outerAu", valueType: { type: "number", unit: "AU" } },
      { id: "widthAu", valueType: { type: "number", unit: "AU" } },
    ]);
  });
});
