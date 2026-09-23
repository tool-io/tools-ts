import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityBefore: number;
  readonly proteinBefore: number;
  readonly activityAfter: number;
  readonly proteinAfter: number;
};
export type Output = {
  readonly foldPurification: number;
  readonly activityRecovery: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityBefore: { type: "number", exclusiveMinimum: 0 },
    proteinBefore: { type: "number", exclusiveMinimum: 0 },
    activityAfter: { type: "number", minimum: 0 },
    proteinAfter: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "activityBefore",
    "proteinBefore",
    "activityAfter",
    "proteinAfter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foldPurification: { type: "number" },
    activityRecovery: { type: "number" },
  },
  required: ["foldPurification", "activityRecovery"],
} as const;
/** Calculate purification specific activity step ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityBefore, proteinBefore, activityAfter, proteinAfter } =
    request;
  const compute = (): Output => {
    H.positive(activityBefore);
    H.positive(proteinBefore);
    H.domain(activityAfter >= 0);
    H.positive(proteinAfter);
    return {
      foldPurification:
        activityAfter / proteinAfter / (activityBefore / proteinBefore),
      activityRecovery: activityAfter / activityBefore,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activityBefore: 1000,
    proteinBefore: 100,
    activityAfter: 800,
    proteinAfter: 20,
  },
  output: { foldPurification: 4, activityRecovery: 0.8 },
} satisfies ToolExample<Input, Output>;
export const purificationSpecificActivityStepRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/purification-specific-activity-step-ratio",
      title: "Purification Specific Activity Step Ratio Tool",
      description:
        "Calculate purification specific activity step ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activityBefore: { type: "number", exclusiveMinimum: 0 },
          proteinBefore: { type: "number", exclusiveMinimum: 0 },
          activityAfter: { type: "number", minimum: 0 },
          proteinAfter: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "activityBefore",
          "proteinBefore",
          "activityAfter",
          "proteinAfter",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          foldPurification: { type: "number" },
          activityRecovery: { type: "number" },
        },
        required: ["foldPurification", "activityRecovery"],
      },
      ports: {
        inputs: [
          {
            id: "activityBefore",
            label: "Activity Before",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "proteinBefore",
            label: "Protein Before",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "activityAfter",
            label: "Activity After",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "proteinAfter",
            label: "Protein After",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "foldPurification",
            label: "Fold Purification",
            valueType: { type: "number" },
          },
          {
            id: "activityRecovery",
            label: "Activity Recovery",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = purificationSpecificActivityStepRatioTool.execute;
export default purificationSpecificActivityStepRatioTool;
