import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly slope: number;
  readonly baseLogit: number;
};
export type Output = { readonly bias: number; readonly biasedLogit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "integer", minimum: 0 },
    slope: { type: "number", minimum: 0 },
    baseLogit: { type: "number" },
  },
  required: ["distance", "slope", "baseLogit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bias: { type: "number" }, biasedLogit: { type: "number" } },
  required: ["bias", "biasedLogit"],
} as const;
/** Calculate alibi attention one distance penalty from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, slope, baseLogit } = request;
  const compute = (): Output => {
    H.integer(distance, 0);
    H.domain(slope >= 0);
    return {
      bias: -slope * distance,
      biasedLogit: baseLogit - slope * distance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 5, slope: 0.2, baseLogit: 3 },
  output: { bias: -1, biasedLogit: 2 },
} satisfies ToolExample<Input, Output>;
export const alibiAttentionOneDistancePenaltyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/alibi-attention-one-distance-penalty",
    title: "Alibi Attention One Distance Penalty Tool",
    description:
      "Calculate alibi attention one distance penalty from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "integer", minimum: 0 },
        slope: { type: "number", minimum: 0 },
        baseLogit: { type: "number" },
      },
      required: ["distance", "slope", "baseLogit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bias: { type: "number" }, biasedLogit: { type: "number" } },
      required: ["bias", "biasedLogit"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseLogit",
          label: "Base Logit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "bias", label: "Bias", valueType: { type: "number" } },
        {
          id: "biasedLogit",
          label: "Biased Logit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = alibiAttentionOneDistancePenaltyTool.execute;
export default alibiAttentionOneDistancePenaltyTool;
