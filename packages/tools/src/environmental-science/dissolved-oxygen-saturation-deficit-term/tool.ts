import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly suppliedSaturation: number;
};
export type Output = {
  readonly deficit: number;
  readonly saturationFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number", minimum: 0 },
    suppliedSaturation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measured", "suppliedSaturation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deficit: { type: "number" },
    saturationFraction: { type: "number" },
  },
  required: ["deficit", "saturationFraction"],
} as const;
/** Use caller-supplied matching-condition saturation concentration; no salinity/temperature lookup is invented. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, suppliedSaturation } = request;
  const compute = (): Output => {
    H.positive(suppliedSaturation);
    H.domain(measured >= 0);
    return {
      deficit: suppliedSaturation - measured,
      saturationFraction: measured / suppliedSaturation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 8, suppliedSaturation: 10 },
  output: { deficit: 2, saturationFraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const dissolvedOxygenSaturationDeficitTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-science/dissolved-oxygen-saturation-deficit-term",
      title: "Dissolved Oxygen Saturation Deficit Term Tool",
      description:
        "Use caller-supplied matching-condition saturation concentration; no salinity/temperature lookup is invented.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measured: { type: "number", minimum: 0 },
          suppliedSaturation: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["measured", "suppliedSaturation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deficit: { type: "number" },
          saturationFraction: { type: "number" },
        },
        required: ["deficit", "saturationFraction"],
      },
      ports: {
        inputs: [
          {
            id: "measured",
            label: "Measured",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedSaturation",
            label: "Supplied Saturation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "deficit", label: "Deficit", valueType: { type: "number" } },
          {
            id: "saturationFraction",
            label: "Saturation Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dissolvedOxygenSaturationDeficitTermTool.execute;
export default dissolvedOxygenSaturationDeficitTermTool;
