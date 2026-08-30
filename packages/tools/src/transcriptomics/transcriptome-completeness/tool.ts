import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly completeOrthologs: number;
  readonly fragmentedOrthologs: number;
  readonly missingOrthologs: number;
  readonly minimumCompletePercent: number;
}>;
export type Output = Readonly<{
  readonly completePercent: number;
  readonly fragmentedPercent: number;
  readonly missingPercent: number;
  readonly passes: boolean;
}>;

export const calculate = (input: Input): Output => {
  const total =
    input.completeOrthologs +
    input.fragmentedOrthologs +
    input.missingOrthologs;
  if (
    total <= 0 ||
    Math.min(
      input.completeOrthologs,
      input.fragmentedOrthologs,
      input.missingOrthologs,
    ) < 0
  )
    simpleError(
      "completeOrthologs",
      "Nonnegative ortholog counts are required.",
    );
  const completePercent = (input.completeOrthologs / total) * 100;
  return {
    completePercent,
    fragmentedPercent: (input.fragmentedOrthologs / total) * 100,
    missingPercent: (input.missingOrthologs / total) * 100,
    passes: completePercent >= input.minimumCompletePercent,
  };
};

export const exampleInput = {
  completeOrthologs: 80,
  fragmentedOrthologs: 10,
  missingOrthologs: 10,
  minimumCompletePercent: 75,
} satisfies Input;
export const exampleOutput = {
  completePercent: 80,
  fragmentedPercent: 10,
  missingPercent: 10,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/transcriptome-completeness",
  title: "Transcriptome Completeness",
  description:
    "Score transcriptome completeness from supplied ortholog classifications.",
  inputs: [
    { id: "completeOrthologs", kind: "number", label: "Complete orthologs" },
    {
      id: "fragmentedOrthologs",
      kind: "number",
      label: "Fragmented orthologs",
    },
    { id: "missingOrthologs", kind: "number", label: "Missing orthologs" },
    {
      id: "minimumCompletePercent",
      kind: "number",
      label: "Minimum complete percent",
    },
  ],
  outputs: [
    { id: "completePercent", kind: "number", label: "Complete percent" },
    { id: "fragmentedPercent", kind: "number", label: "Fragmented percent" },
    { id: "missingPercent", kind: "number", label: "Missing percent" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      completeOrthologs: value.completeOrthologs as number,
      fragmentedOrthologs: value.fragmentedOrthologs as number,
      missingOrthologs: value.missingOrthologs as number,
      minimumCompletePercent: value.minimumCompletePercent as number,
    }),
});
export const run = tool.execute;
export default tool;
