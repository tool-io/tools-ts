import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentId: string;
  readonly siblingOneBased: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentId: { type: "string", maxLength: 8192, minLength: 1 },
    siblingOneBased: { type: "integer", minimum: 1 },
  },
  required: ["parentId", "siblingOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Append an explicit positive sibling index to a lineage parent label without inferring birth order from observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentId, siblingOneBased } = request;
  const compute = (): Output => {
    H.domain(parentId.length > 0, "parentId");
    (H.domain(
      Number.isSafeInteger(siblingOneBased) &&
        siblingOneBased >= 1 &&
        siblingOneBased <= Number.MAX_SAFE_INTEGER,
      "siblingOneBased",
    ),
      siblingOneBased);
    return { label: parentId + "/child-" + siblingOneBased };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentId: "P17", siblingOneBased: 2 },
  output: { label: "P17/child-2" },
} satisfies ToolExample<Input, Output>;
export const lineageBranchSiblingOrderLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/lineage-branch-sibling-order-label",
    title: "Lineage Branch Sibling Order Label Tool",
    description:
      "Append an explicit positive sibling index to a lineage parent label without inferring birth order from observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentId: { type: "string", maxLength: 8192, minLength: 1 },
        siblingOneBased: { type: "integer", minimum: 1 },
      },
      required: ["parentId", "siblingOneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "parentId",
          label: "Parent Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "siblingOneBased",
          label: "Sibling One Based",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = lineageBranchSiblingOrderLabelTool.execute;
export default lineageBranchSiblingOrderLabelTool;
