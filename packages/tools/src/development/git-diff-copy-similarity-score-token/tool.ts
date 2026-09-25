import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly line: string };
export type Output = { readonly percent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { percent: { type: "integer" } },
  required: ["percent"],
} as const;
/** Calculate git diff copy similarity score token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    const r = /^similarity index (\d{1,3})%(?![\s\S])/.exec(line);
    H.domain(r !== null);
    const percent = Number(r[1]);
    H.integer(percent, 0, 100);
    return { percent };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "similarity index 95%" },
  output: { percent: 95 },
} satisfies ToolExample<Input, Output>;
export const gitDiffCopySimilarityScoreTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/git-diff-copy-similarity-score-token",
    title: "Git Diff Copy Similarity Score Token Tool",
    description:
      "Calculate git diff copy similarity score token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { line: { type: "string", maxLength: 8192 } },
      required: ["line"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { percent: { type: "integer" } },
      required: ["percent"],
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
        { id: "percent", label: "Percent", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = gitDiffCopySimilarityScoreTokenTool.execute;
export default gitDiffCopySimilarityScoreTokenTool;
