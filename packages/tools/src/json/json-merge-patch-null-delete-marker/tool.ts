import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly patchJson: string };
export type Output = {
  readonly deleteMember: boolean;
  readonly objectPatch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { patchJson: { type: "string", maxLength: 8192 } },
  required: ["patchJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deleteMember: { type: "boolean" },
    objectPatch: { type: "boolean" },
  },
  required: ["deleteMember", "objectPatch"],
} as const;
/** Classify a merge-patch member value; null means deletion only in an object-member patch context. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { patchJson } = input;
  const compute = (): Output => {
    const x = H.parseJson(patchJson);
    return {
      deleteMember: x === null,
      objectPatch: x !== null && typeof x === "object" && !Array.isArray(x),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { patchJson: "null" },
  output: { deleteMember: true, objectPatch: false },
} satisfies ToolExample<Input, Output>;
export const jsonMergePatchNullDeleteMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-merge-patch-null-delete-marker",
    title: "JSON Merge Patch Null Delete Marker Tool",
    description:
      "Classify a merge-patch member value; null means deletion only in an object-member patch context.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { patchJson: { type: "string", maxLength: 8192 } },
      required: ["patchJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deleteMember: { type: "boolean" },
        objectPatch: { type: "boolean" },
      },
      required: ["deleteMember", "objectPatch"],
    },
    ports: {
      inputs: [
        {
          id: "patchJson",
          label: "Patch Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "deleteMember",
          label: "Delete Member",
          valueType: { type: "boolean" },
        },
        {
          id: "objectPatch",
          label: "Object Patch",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonMergePatchNullDeleteMarkerTool.execute;
export default jsonMergePatchNullDeleteMarkerTool;
