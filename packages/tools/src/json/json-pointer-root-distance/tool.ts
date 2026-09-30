import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pointer: string };
export type Output = { readonly segments: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pointer: { type: "string", maxLength: 8192 } },
  required: ["pointer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { segments: { type: "integer" } },
  required: ["segments"],
} as const;
/** Count decoded-reference traversal levels in a literal RFC 6901 pointer; escaped slashes do not add levels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pointer } = request;
  const compute = (): Output => {
    H.domain(
      (pointer === "" || pointer.startsWith("/")) && !/~(?![01])/.test(pointer),
    );
    return {
      segments: pointer === "" ? 0 : pointer.slice(1).split("/").length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pointer: "/a/~1b" },
  output: { segments: 2 },
} satisfies ToolExample<Input, Output>;
export const jsonPointerRootDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-pointer-root-distance",
    title: "JSON Pointer Root Distance Tool",
    description:
      "Count decoded-reference traversal levels in a literal RFC 6901 pointer; escaped slashes do not add levels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pointer: { type: "string", maxLength: 8192 } },
      required: ["pointer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { segments: { type: "integer" } },
      required: ["segments"],
    },
    ports: {
      inputs: [
        {
          id: "pointer",
          label: "Pointer",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "segments", label: "Segments", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = jsonPointerRootDistanceTool.execute;
export default jsonPointerRootDistanceTool;
