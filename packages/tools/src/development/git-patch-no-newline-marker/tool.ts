import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly line: string };
export type Output = { readonly marker: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { marker: { type: "boolean" } },
  required: ["marker"],
} as const;
/** Calculate git patch no newline marker from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    return { marker: line === "\\ No newline at end of file" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "\\ No newline at end of file" },
  output: { marker: true },
} satisfies ToolExample<Input, Output>;
export const gitPatchNoNewlineMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/git-patch-no-newline-marker",
    title: "Git Patch No Newline Marker Tool",
    description:
      "Calculate git patch no newline marker from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { line: { type: "string", maxLength: 8192 } },
      required: ["line"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { marker: { type: "boolean" } },
      required: ["marker"],
    },
    ports: {
      inputs: [
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "marker", label: "Marker", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gitPatchNoNewlineMarkerTool.execute;
export default gitPatchNoNewlineMarkerTool;
