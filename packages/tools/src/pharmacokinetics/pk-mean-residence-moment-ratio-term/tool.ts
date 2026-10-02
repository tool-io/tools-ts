import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly auc: number;
  readonly aumc: number;
  readonly inputDuration: number;
  readonly subtractHalfDuration: boolean;
};
export type Output = {
  readonly momentRatio: number;
  readonly adjustedResidence: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    auc: { type: "number", exclusiveMinimum: 0 },
    aumc: { type: "number", minimum: 0 },
    inputDuration: { type: "number", minimum: 0 },
    subtractHalfDuration: { type: "boolean" },
  },
  required: ["auc", "aumc", "inputDuration", "subtractHalfDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    momentRatio: { type: "number" },
    adjustedResidence: { type: "number" },
  },
  required: ["momentRatio", "adjustedResidence"],
} as const;
/** Calculate pk mean residence moment ratio term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { auc, aumc, inputDuration, subtractHalfDuration } = request;
  const compute = (): Output => {
    H.positive(auc);
    H.domain(aumc >= 0 && inputDuration >= 0);
    return {
      momentRatio: aumc / auc,
      adjustedResidence:
        aumc / auc - (subtractHalfDuration ? inputDuration / 2 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { auc: 20, aumc: 100, inputDuration: 2, subtractHalfDuration: true },
  output: { momentRatio: 5, adjustedResidence: 4 },
} satisfies ToolExample<Input, Output>;
export const pkMeanResidenceMomentRatioTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-mean-residence-moment-ratio-term",
    title: "PK Mean Residence Moment Ratio Term Tool",
    description:
      "Calculate pk mean residence moment ratio term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        auc: { type: "number", exclusiveMinimum: 0 },
        aumc: { type: "number", minimum: 0 },
        inputDuration: { type: "number", minimum: 0 },
        subtractHalfDuration: { type: "boolean" },
      },
      required: ["auc", "aumc", "inputDuration", "subtractHalfDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        momentRatio: { type: "number" },
        adjustedResidence: { type: "number" },
      },
      required: ["momentRatio", "adjustedResidence"],
    },
    ports: {
      inputs: [
        {
          id: "auc",
          label: "Auc",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aumc",
          label: "Aumc",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputDuration",
          label: "Input Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subtractHalfDuration",
          label: "Subtract Half Duration",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "momentRatio",
          label: "Moment Ratio",
          valueType: { type: "number" },
        },
        {
          id: "adjustedResidence",
          label: "Adjusted Residence",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkMeanResidenceMomentRatioTermTool.execute;
export default pkMeanResidenceMomentRatioTermTool;
