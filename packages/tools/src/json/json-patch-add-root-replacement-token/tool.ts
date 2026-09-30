import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly path: string };
export type Output = { readonly replacesDocument: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { path: { type: "string", maxLength: 8192 } },
  required: ["path"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { replacesDocument: { type: "boolean" } },
  required: ["replacesDocument"],
} as const;
/** Calculate json patch add root replacement token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { path } = input;
  const compute = (): Output => {
    H.domain(path === "" || path.startsWith("/"));
    return { replacesDocument: path === "" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { path: "" },
  output: { replacesDocument: true },
} satisfies ToolExample<Input, Output>;
export const jsonPatchAddRootReplacementTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-patch-add-root-replacement-token",
    title: "JSON Patch Add Root Replacement Token Tool",
    description:
      "Calculate json patch add root replacement token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { path: { type: "string", maxLength: 8192 } },
      required: ["path"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { replacesDocument: { type: "boolean" } },
      required: ["replacesDocument"],
    },
    ports: {
      inputs: [
        {
          id: "path",
          label: "Path",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "replacesDocument",
          label: "Replaces Document",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonPatchAddRootReplacementTokenTool.execute;
export default jsonPatchAddRootReplacementTokenTool;
