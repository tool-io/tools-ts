import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly groupId: string; readonly splitLabel: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupId: { type: "string", maxLength: 8192, minLength: 1 },
    splitLabel: {
      type: "string",
      maxLength: 8192,
      enum: ["train", "validation", "test", "excluded"],
    },
  },
  required: ["groupId", "splitLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label an explicitly assigned dataset group split without generating a split or validating group isolation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupId, splitLabel } = request;
  const compute = (): Output => {
    H.domain(groupId.length > 0, "groupId");
    H.domain(
      ["train", "validation", "test", "excluded"].includes(splitLabel),
      "splitLabel",
    );
    return { tag: groupId + " [" + splitLabel + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupId: "G17", splitLabel: "test" },
  output: { tag: "G17 [test]" },
} satisfies ToolExample<Input, Output>;
export const datasetSplitSingleGroupTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/dataset-split-single-group-tag",
    title: "Dataset Split Single Group Tag",
    description:
      "Label an explicitly assigned dataset group split without generating a split or validating group isolation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupId: { type: "string", maxLength: 8192, minLength: 1 },
        splitLabel: {
          type: "string",
          maxLength: 8192,
          enum: ["train", "validation", "test", "excluded"],
        },
      },
      required: ["groupId", "splitLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "groupId",
          label: "Group Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "splitLabel",
          label: "Split Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = datasetSplitSingleGroupTagTool.execute;
export default datasetSplitSingleGroupTagTool;
