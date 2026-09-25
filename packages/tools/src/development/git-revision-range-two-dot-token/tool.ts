import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly range: string };
export type Output = { readonly exclude: string; readonly include: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { range: { type: "string", maxLength: 8192 } },
  required: ["range"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exclude: { type: "string", maxLength: 8192 },
    include: { type: "string", maxLength: 8192 },
  },
  required: ["exclude", "include"],
} as const;
/** Split an explicit simple two-dot revision range; omitted endpoints and revision operators are excluded. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { range } = input;
  const compute = (): Output => {
    const p = range.split("..");
    H.domain(
      p.length === 2 &&
        p.every((s) => s.length > 0 && !s.includes(".") && !/\s/.test(s)),
    );
    return { exclude: p[0], include: p[1] };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { range: "main..feature" },
  output: { exclude: "main", include: "feature" },
} satisfies ToolExample<Input, Output>;
export const gitRevisionRangeTwoDotTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/git-revision-range-two-dot-token",
    title: "Git Revision Range Two Dot Token Tool",
    description:
      "Split an explicit simple two-dot revision range; omitted endpoints and revision operators are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { range: { type: "string", maxLength: 8192 } },
      required: ["range"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exclude: { type: "string", maxLength: 8192 },
        include: { type: "string", maxLength: 8192 },
      },
      required: ["exclude", "include"],
    },
    ports: {
      inputs: [
        {
          id: "range",
          label: "Range",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "exclude", label: "Exclude", valueType: { type: "string" } },
        { id: "include", label: "Include", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gitRevisionRangeTwoDotTokenTool.execute;
export default gitRevisionRangeTwoDotTokenTool;
