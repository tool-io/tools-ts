import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFixed: number;
  readonly firstVariable: number;
  readonly secondFixed: number;
  readonly secondVariable: number;
  readonly volume: number;
};
export type Output = {
  readonly breakEvenVolume: number;
  readonly firstCost: number;
  readonly secondCost: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFixed: { type: "number" },
    firstVariable: { type: "number" },
    secondFixed: { type: "number" },
    secondVariable: { type: "number" },
    volume: { type: "number", minimum: 0 },
  },
  required: [
    "firstFixed",
    "firstVariable",
    "secondFixed",
    "secondVariable",
    "volume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    breakEvenVolume: { type: "number" },
    firstCost: { type: "number" },
    secondCost: { type: "number" },
    difference: { type: "number" },
  },
  required: ["breakEvenVolume", "firstCost", "secondCost", "difference"],
} as const;
/** Intersection of two supplied affine cost alternatives; negative break-even volume remains visible if no positive-volume crossing exists. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFixed, firstVariable, secondFixed, secondVariable, volume } =
    request;
  const compute = (): Output => {
    H.domain(firstVariable !== secondVariable && volume >= 0);
    return {
      breakEvenVolume:
        (secondFixed - firstFixed) / (firstVariable - secondVariable),
      firstCost: firstFixed + firstVariable * volume,
      secondCost: secondFixed + secondVariable * volume,
      difference:
        firstFixed - secondFixed + (firstVariable - secondVariable) * volume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstFixed: 1000,
    firstVariable: 10,
    secondFixed: 3000,
    secondVariable: 6,
    volume: 400,
  },
  output: {
    breakEvenVolume: 500,
    firstCost: 5000,
    secondCost: 5400,
    difference: -400,
  },
} satisfies ToolExample<Input, Output>;
export const productionCostFixedVariableBreakpointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-engineering/production-cost-fixed-variable-breakpoint",
      title: "Production Cost Fixed Variable Breakpoint Tool",
      description:
        "Intersection of two supplied affine cost alternatives; negative break-even volume remains visible if no positive-volume crossing exists.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstFixed: { type: "number" },
          firstVariable: { type: "number" },
          secondFixed: { type: "number" },
          secondVariable: { type: "number" },
          volume: { type: "number", minimum: 0 },
        },
        required: [
          "firstFixed",
          "firstVariable",
          "secondFixed",
          "secondVariable",
          "volume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          breakEvenVolume: { type: "number" },
          firstCost: { type: "number" },
          secondCost: { type: "number" },
          difference: { type: "number" },
        },
        required: ["breakEvenVolume", "firstCost", "secondCost", "difference"],
      },
      ports: {
        inputs: [
          {
            id: "firstFixed",
            label: "First Fixed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstVariable",
            label: "First Variable",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondFixed",
            label: "Second Fixed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondVariable",
            label: "Second Variable",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "breakEvenVolume",
            label: "Break Even Volume",
            valueType: { type: "number" },
          },
          {
            id: "firstCost",
            label: "First Cost",
            valueType: { type: "number" },
          },
          {
            id: "secondCost",
            label: "Second Cost",
            valueType: { type: "number" },
          },
          {
            id: "difference",
            label: "Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = productionCostFixedVariableBreakpointTool.execute;
export default productionCostFixedVariableBreakpointTool;
