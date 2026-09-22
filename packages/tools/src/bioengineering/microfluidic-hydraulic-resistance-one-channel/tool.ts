import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly viscosity: number;
  readonly length: number;
  readonly width: number;
  readonly height: number;
};
export type Output = { readonly resistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    viscosity: { type: "number", minimum: 0 },
    length: { type: "number", minimum: 0 },
    width: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["viscosity", "length", "width", "height"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { resistance: { type: "number" } },
  required: ["resistance"],
} as const;
/** Rectangular-channel laminar resistance using the 1-0.63*h/w first-order aspect correction; h<=w and consistent SI units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { viscosity, length, width, height } = request;
  const compute = (): Output => {
    H.domain(viscosity >= 0 && length >= 0);
    H.positive(width);
    H.positive(height);
    H.domain(height <= width);
    return {
      resistance:
        (12 * viscosity * length) /
        (width * height ** 3 * (1 - (0.63 * height) / width)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { viscosity: 1, length: 2, width: 4, height: 1 },
  output: { resistance: 7.121661721068249 },
} satisfies ToolExample<Input, Output>;
export const microfluidicHydraulicResistanceOneChannelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioengineering/microfluidic-hydraulic-resistance-one-channel",
      title: "Microfluidic Hydraulic Resistance One Channel Tool",
      description:
        "Rectangular-channel laminar resistance using the 1-0.63*h/w first-order aspect correction; h<=w and consistent SI units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          viscosity: { type: "number", minimum: 0 },
          length: { type: "number", minimum: 0 },
          width: { type: "number", exclusiveMinimum: 0 },
          height: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["viscosity", "length", "width", "height"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { resistance: { type: "number" } },
        required: ["resistance"],
      },
      ports: {
        inputs: [
          {
            id: "viscosity",
            label: "Viscosity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "length",
            label: "Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "width",
            label: "Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "height",
            label: "Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "resistance",
            label: "Resistance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = microfluidicHydraulicResistanceOneChannelTool.execute;
export default microfluidicHydraulicResistanceOneChannelTool;
