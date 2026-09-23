import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fluidDensity: number;
  readonly gravity: number;
  readonly heightDifference: number;
  readonly pressurePa: number;
};
export type Output = {
  readonly offsetPa: number;
  readonly correctedPressurePa: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fluidDensity: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    heightDifference: { type: "number" },
    pressurePa: { type: "number" },
  },
  required: ["fluidDensity", "gravity", "heightDifference", "pressurePa"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetPa: { type: "number" },
    correctedPressurePa: { type: "number" },
  },
  required: ["offsetPa", "correctedPressurePa"],
} as const;
/** Subtract a supplied hydrostatic column offset, height positive above the reference; no device setup or clinical pressure target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fluidDensity, gravity, heightDifference, pressurePa } = request;
  const compute = (): Output => {
    H.positive(fluidDensity);
    H.positive(gravity);
    return {
      offsetPa: fluidDensity * gravity * heightDifference,
      correctedPressurePa:
        pressurePa - fluidDensity * gravity * heightDifference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fluidDensity: 1000,
    gravity: 9.8,
    heightDifference: 0.1,
    pressurePa: 2000,
  },
  output: { offsetPa: 980, correctedPressurePa: 1020 },
} satisfies ToolExample<Input, Output>;
export const pressureTransducerHydrostaticOffsetTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cardiology/pressure-transducer-hydrostatic-offset-term",
      title: "Pressure Transducer Hydrostatic Offset Term Tool",
      description:
        "Subtract a supplied hydrostatic column offset, height positive above the reference; no device setup or clinical pressure target.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fluidDensity: { type: "number", exclusiveMinimum: 0 },
          gravity: { type: "number", exclusiveMinimum: 0 },
          heightDifference: { type: "number" },
          pressurePa: { type: "number" },
        },
        required: ["fluidDensity", "gravity", "heightDifference", "pressurePa"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          offsetPa: { type: "number" },
          correctedPressurePa: { type: "number" },
        },
        required: ["offsetPa", "correctedPressurePa"],
      },
      ports: {
        inputs: [
          {
            id: "fluidDensity",
            label: "Fluid Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gravity",
            label: "Gravity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "heightDifference",
            label: "Height Difference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pressurePa",
            label: "Pressure Pa",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "offsetPa", label: "Offset Pa", valueType: { type: "number" } },
          {
            id: "correctedPressurePa",
            label: "Corrected Pressure Pa",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pressureTransducerHydrostaticOffsetTermTool.execute;
export default pressureTransducerHydrostaticOffsetTermTool;
