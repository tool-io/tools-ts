import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly renditionId: string };
export type Output = { readonly pointer: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    renditionId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["renditionId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pointer: { type: "string", maxLength: 8192 } },
  required: ["pointer"],
} as const;
/** Prefix a supplied local TEI rendition identifier with a fragment marker without validating XML names or resolving a document. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { renditionId } = request;
  const compute = (): Output => {
    H.domain(
      renditionId.length > 0 && !/[\s#]/.test(renditionId),
      "renditionId",
    );
    return { pointer: "#" + renditionId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { renditionId: "rend17" },
  output: { pointer: "#rend17" },
} satisfies ToolExample<Input, Output>;
export const teiRenditionPointerTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/tei-rendition-pointer-token",
    title: "TEI Rendition Pointer Token Tool",
    description:
      "Prefix a supplied local TEI rendition identifier with a fragment marker without validating XML names or resolving a document.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        renditionId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["renditionId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pointer: { type: "string", maxLength: 8192 } },
      required: ["pointer"],
    },
    ports: {
      inputs: [
        {
          id: "renditionId",
          label: "Rendition Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "pointer", label: "Pointer", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = teiRenditionPointerTokenTool.execute;
export default teiRenditionPointerTokenTool;
