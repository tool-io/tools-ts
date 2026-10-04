import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heightDifference: number;
  readonly density: number;
  readonly gravity: number;
  readonly lossPressure: number;
};
export type Output = {
  readonly staticPressure: number;
  readonly totalDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightDifference: { type: "number" },
    density: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    lossPressure: { type: "number" },
  },
  required: ["heightDifference", "density", "gravity", "lossPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    staticPressure: { type: "number" },
    totalDifference: { type: "number" },
  },
  required: ["staticPressure", "totalDifference"],
} as const;
/** Supplied static head and signed pressure-loss bookkeeping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heightDifference, density, gravity, lossPressure } = request;
  const compute = (): Output => {
    H.positive(density);
    H.positive(gravity);
    return {
      staticPressure: heightDifference * density * gravity,
      totalDifference: heightDifference * density * gravity + lossPressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heightDifference: 2, density: 1000, gravity: 10, lossPressure: 500 },
  output: { staticPressure: 20000, totalDifference: 20500 },
} satisfies ToolExample<Input, Output>;
export const nutrientLoopTopBottomPressureHeadGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vertical-farming/nutrient-loop-top-bottom-pressure-head-gap",
      title: "Nutrient Loop Top Bottom Pressure Head Gap Tool",
      description: "Supplied static head and signed pressure-loss bookkeeping.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          heightDifference: { type: "number" },
          density: { type: "number", exclusiveMinimum: 0 },
          gravity: { type: "number", exclusiveMinimum: 0 },
          lossPressure: { type: "number" },
        },
        required: ["heightDifference", "density", "gravity", "lossPressure"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          staticPressure: { type: "number" },
          totalDifference: { type: "number" },
        },
        required: ["staticPressure", "totalDifference"],
      },
      ports: {
        inputs: [
          {
            id: "heightDifference",
            label: "Height Difference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "density",
            label: "Density",
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
            id: "lossPressure",
            label: "Loss Pressure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "staticPressure",
            label: "Static Pressure",
            valueType: { type: "number" },
          },
          {
            id: "totalDifference",
            label: "Total Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nutrientLoopTopBottomPressureHeadGapTool.execute;
export default nutrientLoopTopBottomPressureHeadGapTool;
