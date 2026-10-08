import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectCode: string;
  readonly useCode: string;
  readonly contextCode: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectCode: { type: "string", maxLength: 8192, minLength: 1 },
    useCode: { type: "string", maxLength: 8192, minLength: 1 },
    contextCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectCode", "useCode", "contextCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Encode an explicitly annotated object-use context without inferring a cultural practice from an object. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectCode, useCode, contextCode } = request;
  const compute = (): Output => {
    H.domain(
      objectCode.length > 0 && useCode.length > 0 && contextCode.length > 0,
      "objectCode",
    );
    return { tag: JSON.stringify([objectCode, useCode, contextCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objectCode: "O17", useCode: "U3", contextCode: "C2" },
  output: { tag: '["O17","U3","C2"]' },
} satisfies ToolExample<Input, Output>;
export const materialObjectUseContextTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "cultural-anthropology",
        "cultural anthropology",
        "social sciences",
      ],
      keywords: ["cultural anthropology", "social sciences"],
    },
    id: "cultural-anthropology/material-object-use-context-tag",
    title: "Material Object Use Context Tag",
    description:
      "Encode an explicitly annotated object-use context without inferring a cultural practice from an object.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectCode: { type: "string", maxLength: 8192, minLength: 1 },
        useCode: { type: "string", maxLength: 8192, minLength: 1 },
        contextCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["objectCode", "useCode", "contextCode"],
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
          id: "objectCode",
          label: "Object Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "useCode",
          label: "Use Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "contextCode",
          label: "Context Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = materialObjectUseContextTagTool.execute;
export default materialObjectUseContextTagTool;
