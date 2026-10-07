import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalActivity: number;
  readonly solutionVolume: number;
};
export type Output = { readonly activityPerVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalActivity: { type: "number", minimum: 0 },
    solutionVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalActivity", "solutionVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activityPerVolume: { type: "number" } },
  required: ["activityPerVolume"],
} as const;
/** Divide explicit total biochemical activity by positive solution volume in caller-supplied compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalActivity, solutionVolume } = request;
  const compute = (): Output => {
    H.domain(totalActivity >= 0, "totalActivity");
    (H.domain(
      Number.isFinite(solutionVolume) && solutionVolume > 0,
      "solutionVolume",
    ),
      solutionVolume);
    return { activityPerVolume: totalActivity / solutionVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalActivity: 120, solutionVolume: 4 },
  output: { activityPerVolume: 30 },
} satisfies ToolExample<Input, Output>;
export const biochemicalActivityConcentrationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biochemistry", "biology"],
        keywords: ["biochemistry", "biology"],
      },
      id: "biochemistry/biochemical-activity-concentration-factor",
      title: "Biochemical Activity Concentration Factor",
      description:
        "Divide explicit total biochemical activity by positive solution volume in caller-supplied compatible units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalActivity: { type: "number", minimum: 0 },
          solutionVolume: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["totalActivity", "solutionVolume"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { activityPerVolume: { type: "number" } },
        required: ["activityPerVolume"],
      },
      ports: {
        inputs: [
          {
            id: "totalActivity",
            label: "Total Activity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solutionVolume",
            label: "Solution Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "activityPerVolume",
            label: "Activity Per Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biochemicalActivityConcentrationFactorTool.execute;
export default biochemicalActivityConcentrationFactorTool;
