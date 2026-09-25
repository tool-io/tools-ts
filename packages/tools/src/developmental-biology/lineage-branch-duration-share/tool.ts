import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchDuration: number;
  readonly totalLineageDuration: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchDuration: { type: "number", minimum: 0 },
    totalLineageDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["branchDuration", "totalLineageDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate lineage branch duration share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchDuration, totalLineageDuration } = request;
  const compute = (): Output => {
    H.positive(totalLineageDuration);
    H.domain(branchDuration >= 0 && branchDuration <= totalLineageDuration);
    return { share: branchDuration / totalLineageDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchDuration: 3, totalLineageDuration: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const lineageBranchDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/lineage-branch-duration-share",
    title: "Lineage Branch Duration Share Tool",
    description:
      "Calculate lineage branch duration share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchDuration: { type: "number", minimum: 0 },
        totalLineageDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["branchDuration", "totalLineageDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "branchDuration",
          label: "Branch Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalLineageDuration",
          label: "Total Lineage Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = lineageBranchDurationShareTool.execute;
export default lineageBranchDurationShareTool;
