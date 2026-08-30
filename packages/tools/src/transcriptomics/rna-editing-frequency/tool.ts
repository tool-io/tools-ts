import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly editedReads: number;
  readonly totalCoveredReads: number;
  readonly minimumEditingPercent: number;
}>;
export type Output = Readonly<{
  readonly editingPercent: number;
  readonly uneditedReads: number;
  readonly edited: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.totalCoveredReads <= 0 ||
    input.editedReads < 0 ||
    input.editedReads > input.totalCoveredReads
  )
    simpleError(
      "editedReads",
      "Edited reads must not exceed positive coverage.",
    );
  const editingPercent = (input.editedReads / input.totalCoveredReads) * 100;
  return {
    editingPercent,
    uneditedReads: input.totalCoveredReads - input.editedReads,
    edited: editingPercent >= input.minimumEditingPercent,
  };
};

export const exampleInput = {
  editedReads: 15,
  totalCoveredReads: 100,
  minimumEditingPercent: 10,
} satisfies Input;
export const exampleOutput = {
  editingPercent: 15,
  uneditedReads: 85,
  edited: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/rna-editing-frequency",
  title: "RNA Editing Frequency",
  description:
    "Calculate A-to-I RNA-editing frequency from aligned read counts.",
  inputs: [
    { id: "editedReads", kind: "number", label: "Edited reads" },
    { id: "totalCoveredReads", kind: "number", label: "Total covered reads" },
    {
      id: "minimumEditingPercent",
      kind: "number",
      label: "Minimum editing percent",
    },
  ],
  outputs: [
    { id: "editingPercent", kind: "number", label: "Editing percent" },
    { id: "uneditedReads", kind: "number", label: "Unedited reads" },
    { id: "edited", kind: "boolean", label: "Edited" },
  ],
  calculate: (value) =>
    calculate({
      editedReads: value.editedReads as number,
      totalCoveredReads: value.totalCoveredReads as number,
      minimumEditingPercent: value.minimumEditingPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
