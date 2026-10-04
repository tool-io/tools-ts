import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentId: string;
  readonly relationshipStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentId: { type: "string", maxLength: 8192 },
    relationshipStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["confirmed", "uncertain", "disputed"],
    },
  },
  required: ["parentId", "relationshipStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a parent link with an explicitly supplied certainty status, without determining parentage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentId, relationshipStatus } = request;
  const compute = (): Output => {
    H.domain(parentId.length > 0, "parentId");
    H.domain(
      ["confirmed", "uncertain", "disputed"].includes(relationshipStatus),
      "relationshipStatus",
    );
    return {
      label:
        parentId +
        (relationshipStatus === "confirmed"
          ? ""
          : " [" + relationshipStatus + " parent]"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentId: "P-7", relationshipStatus: "uncertain" },
  output: { label: "P-7 [uncertain parent]" },
} satisfies ToolExample<Input, Output>;
export const genealogicalUncertainParentLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/genealogical-uncertain-parent-label",
    title: "Genealogical Uncertain Parent Label Tool",
    description:
      "Label a parent link with an explicitly supplied certainty status, without determining parentage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentId: { type: "string", maxLength: 8192 },
        relationshipStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["confirmed", "uncertain", "disputed"],
        },
      },
      required: ["parentId", "relationshipStatus"],
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
          id: "relationshipStatus",
          label: "Relationship Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = genealogicalUncertainParentLabelTool.execute;
export default genealogicalUncertainParentLabelTool;
