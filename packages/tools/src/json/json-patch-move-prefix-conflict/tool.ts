import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly from: string; readonly path: string };
export type Output = { readonly conflict: boolean; readonly same: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    from: { type: "string", maxLength: 8192 },
    path: { type: "string", maxLength: 8192 },
  },
  required: ["from", "path"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { conflict: { type: "boolean" }, same: { type: "boolean" } },
  required: ["conflict", "same"],
} as const;
/** Calculate json patch move prefix conflict from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { from, path } = input;
  const compute = (): Output => {
    H.domain(
      (from === "" || from.startsWith("/")) &&
        (path === "" || path.startsWith("/")),
    );
    return {
      conflict: path !== from && (from === "" || path.startsWith(from + "/")),
      same: from === path,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { from: "/a", path: "/a/b" },
  output: { conflict: true, same: false },
} satisfies ToolExample<Input, Output>;
export const jsonPatchMovePrefixConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-patch-move-prefix-conflict",
    title: "JSON Patch Move Prefix Conflict Tool",
    description:
      "Calculate json patch move prefix conflict from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        from: { type: "string", maxLength: 8192 },
        path: { type: "string", maxLength: 8192 },
      },
      required: ["from", "path"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { conflict: { type: "boolean" }, same: { type: "boolean" } },
      required: ["conflict", "same"],
    },
    ports: {
      inputs: [
        {
          id: "from",
          label: "From",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "path",
          label: "Path",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "conflict", label: "Conflict", valueType: { type: "boolean" } },
        { id: "same", label: "Same", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = jsonPatchMovePrefixConflictTool.execute;
export default jsonPatchMovePrefixConflictTool;
