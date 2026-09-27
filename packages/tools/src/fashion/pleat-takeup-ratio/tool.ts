import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flatWidth: number;
  readonly finishedWidth: number;
};
export type Output = { readonly takeup: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flatWidth: { type: "number" },
    finishedWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["flatWidth", "finishedWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { takeup: { type: "number" }, ratio: { type: "number" } },
  required: ["takeup", "ratio"],
} as const;
/** Calculate pleat takeup ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flatWidth, finishedWidth } = request;
  const compute = (): Output => {
    H.positive(finishedWidth);
    H.domain(flatWidth >= finishedWidth);
    return {
      takeup: flatWidth - finishedWidth,
      ratio: (flatWidth - finishedWidth) / finishedWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flatWidth: 30, finishedWidth: 10 },
  output: { takeup: 20, ratio: 2 },
} satisfies ToolExample<Input, Output>;
export const pleatTakeupRatioTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "fashion/pleat-takeup-ratio",
    title: "Pleat Takeup Ratio Tool",
    description:
      "Calculate pleat takeup ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flatWidth: { type: "number" },
        finishedWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["flatWidth", "finishedWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { takeup: { type: "number" }, ratio: { type: "number" } },
      required: ["takeup", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "flatWidth",
          label: "Flat Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finishedWidth",
          label: "Finished Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "takeup", label: "Takeup", valueType: { type: "number" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pleatTakeupRatioTool.execute;
export default pleatTakeupRatioTool;
