import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly referenceRatio: number;
};
export type Output = {
  readonly ratio: number;
  readonly symmetryIndex: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number", minimum: 0 },
    right: { type: "number", exclusiveMinimum: 0 },
    referenceRatio: { type: "number" },
  },
  required: ["left", "right", "referenceRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    symmetryIndex: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["ratio", "symmetryIndex", "referenceGap"],
} as const;
/** Supplied bilateral research ratio and signed mean-normalized symmetry index, without a gait abnormality classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, right, referenceRatio } = request;
  const compute = (): Output => {
    H.domain(left >= 0);
    H.positive(right);
    return {
      ratio: left / right,
      symmetryIndex: (2 * (left - right)) / (left + right),
      referenceGap: left / right - referenceRatio,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { left: 12, right: 10, referenceRatio: 1 },
  output: {
    ratio: 1.2,
    symmetryIndex: 0.18181818181818182,
    referenceGap: 0.19999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const gaitResearchLeftRightRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/gait-research-left-right-ratio",
    title: "Gait Research Left Right Ratio Tool",
    description:
      "Supplied bilateral research ratio and signed mean-normalized symmetry index, without a gait abnormality classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number", minimum: 0 },
        right: { type: "number", exclusiveMinimum: 0 },
        referenceRatio: { type: "number" },
      },
      required: ["left", "right", "referenceRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        symmetryIndex: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["ratio", "symmetryIndex", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "symmetryIndex",
          label: "Symmetry Index",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaitResearchLeftRightRatioTool.execute;
export default gaitResearchLeftRightRatioTool;
