import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incrementalCost: number;
  readonly incrementalEffect: number;
};
export type Output = { readonly quadrant: string; readonly atOrigin: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalCost: { type: "number" },
    incrementalEffect: { type: "number" },
  },
  required: ["incrementalCost", "incrementalEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quadrant: { type: "string", maxLength: 8192 },
    atOrigin: { type: "boolean" },
  },
  required: ["quadrant", "atOrigin"],
} as const;
/** Classify supplied incremental cost/effect signs without an ICER, threshold or intervention ranking. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incrementalCost, incrementalEffect } = request;
  const compute = (): Output => {
    return {
      quadrant:
        incrementalCost === 0 && incrementalEffect === 0
          ? "origin"
          : incrementalCost === 0
            ? incrementalEffect > 0
              ? "effect-positive-axis"
              : "effect-negative-axis"
            : incrementalEffect === 0
              ? incrementalCost > 0
                ? "cost-positive-axis"
                : "cost-negative-axis"
              : incrementalCost > 0
                ? incrementalEffect > 0
                  ? "cost-positive-effect-positive"
                  : "cost-positive-effect-negative"
                : incrementalEffect > 0
                  ? "cost-negative-effect-positive"
                  : "cost-negative-effect-negative",
      atOrigin: incrementalCost === 0 && incrementalEffect === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { incrementalCost: 100, incrementalEffect: 2 },
  output: { quadrant: "cost-positive-effect-positive", atOrigin: false },
} satisfies ToolExample<Input, Output>;
export const incrementalCostSignQuadrantTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/incremental-cost-sign-quadrant",
    title: "Incremental Cost Sign Quadrant Tool",
    description:
      "Classify supplied incremental cost/effect signs without an ICER, threshold or intervention ranking.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incrementalCost: { type: "number" },
        incrementalEffect: { type: "number" },
      },
      required: ["incrementalCost", "incrementalEffect"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quadrant: { type: "string", maxLength: 8192 },
        atOrigin: { type: "boolean" },
      },
      required: ["quadrant", "atOrigin"],
    },
    ports: {
      inputs: [
        {
          id: "incrementalCost",
          label: "Incremental Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incrementalEffect",
          label: "Incremental Effect",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "quadrant", label: "Quadrant", valueType: { type: "string" } },
        { id: "atOrigin", label: "At Origin", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = incrementalCostSignQuadrantTool.execute;
export default incrementalCostSignQuadrantTool;
