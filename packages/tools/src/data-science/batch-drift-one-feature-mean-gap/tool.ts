import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceMean: number;
  readonly batchMean: number;
  readonly referenceSd: number;
};
export type Output = {
  readonly difference: number;
  readonly standardizedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceMean: { type: "number" },
    batchMean: { type: "number" },
    referenceSd: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["referenceMean", "batchMean", "referenceSd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    standardizedGap: { type: "number" },
  },
  required: ["difference", "standardizedGap"],
} as const;
/** Calculate batch drift one feature mean gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceMean, batchMean, referenceSd } = request;
  const compute = (): Output => {
    H.positive(referenceSd);
    return {
      difference: batchMean - referenceMean,
      standardizedGap: (batchMean - referenceMean) / referenceSd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceMean: 10, batchMean: 12, referenceSd: 4 },
  output: { difference: 2, standardizedGap: 0.5 },
} satisfies ToolExample<Input, Output>;
export const batchDriftOneFeatureMeanGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/batch-drift-one-feature-mean-gap",
    title: "Batch Drift One Feature Mean Gap Tool",
    description:
      "Calculate batch drift one feature mean gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceMean: { type: "number" },
        batchMean: { type: "number" },
        referenceSd: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["referenceMean", "batchMean", "referenceSd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        standardizedGap: { type: "number" },
      },
      required: ["difference", "standardizedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceMean",
          label: "Reference Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "batchMean",
          label: "Batch Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSd",
          label: "Reference Sd",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        {
          id: "standardizedGap",
          label: "Standardized Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = batchDriftOneFeatureMeanGapTool.execute;
export default batchDriftOneFeatureMeanGapTool;
