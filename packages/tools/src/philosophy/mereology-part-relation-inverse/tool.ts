import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly partId: string; readonly wholeId: string };
export type Output = {
  readonly inverseSubject: string;
  readonly inverseRelation: string;
  readonly inverseObject: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partId: { type: "string", maxLength: 8192 },
    wholeId: { type: "string", maxLength: 8192 },
  },
  required: ["partId", "wholeId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverseSubject: { type: "string", maxLength: 8192 },
    inverseRelation: { type: "string", maxLength: 8192 },
    inverseObject: { type: "string", maxLength: 8192 },
  },
  required: ["inverseSubject", "inverseRelation", "inverseObject"],
} as const;
/** Invert an explicitly asserted part-of relation into has-part without verifying the underlying relation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partId, wholeId } = request;
  const compute = (): Output => {
    H.domain(partId.length > 0 && wholeId.length > 0, "partId");
    return {
      inverseSubject: wholeId,
      inverseRelation: "has-part",
      inverseObject: partId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { partId: "wheel", wholeId: "bicycle" },
  output: {
    inverseSubject: "bicycle",
    inverseRelation: "has-part",
    inverseObject: "wheel",
  },
} satisfies ToolExample<Input, Output>;
export const mereologyPartRelationInverseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/mereology-part-relation-inverse",
    title: "Mereology Part Relation Inverse Tool",
    description:
      "Invert an explicitly asserted part-of relation into has-part without verifying the underlying relation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partId: { type: "string", maxLength: 8192 },
        wholeId: { type: "string", maxLength: 8192 },
      },
      required: ["partId", "wholeId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inverseSubject: { type: "string", maxLength: 8192 },
        inverseRelation: { type: "string", maxLength: 8192 },
        inverseObject: { type: "string", maxLength: 8192 },
      },
      required: ["inverseSubject", "inverseRelation", "inverseObject"],
    },
    ports: {
      inputs: [
        {
          id: "partId",
          label: "Part Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "wholeId",
          label: "Whole Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "inverseSubject",
          label: "Inverse Subject",
          valueType: { type: "string" },
        },
        {
          id: "inverseRelation",
          label: "Inverse Relation",
          valueType: { type: "string" },
        },
        {
          id: "inverseObject",
          label: "Inverse Object",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = mereologyPartRelationInverseTool.execute;
export default mereologyPartRelationInverseTool;
