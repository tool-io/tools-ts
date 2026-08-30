import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly editorCount: number;
  readonly reporterCount: number;
  readonly targetReportersPerEditor: number;
}>;
export type Output = Readonly<{
  readonly reportersPerEditor: number;
  readonly additionalEditorsNeeded: number;
  readonly meetsTarget: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.editorCount <= 0 || input.targetReportersPerEditor <= 0)
    simpleError(
      "editorCount",
      "Editor count and target ratio must be positive.",
      "invalid_staffing",
    );
  const reportersPerEditor = input.reporterCount / input.editorCount;
  return {
    reportersPerEditor,
    additionalEditorsNeeded: Math.max(
      0,
      Math.ceil(input.reporterCount / input.targetReportersPerEditor) -
        input.editorCount,
    ),
    meetsTarget: reportersPerEditor <= input.targetReportersPerEditor,
  };
};

export const exampleInput = {
  editorCount: 2,
  reporterCount: 10,
  targetReportersPerEditor: 4,
} satisfies Input;
export const exampleOutput = {
  reportersPerEditor: 5,
  additionalEditorsNeeded: 1,
  meetsTarget: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      editorCount: input.editorCount as number,
      reporterCount: input.reporterCount as number,
      targetReportersPerEditor: input.targetReportersPerEditor as number,
    }),
  description:
    "Compare newsroom editor staffing with a supplied reporters-per-editor target.",
  id: "journalism/editor-staffing-ratio",
  inputs: [
    { id: "editorCount", label: "Editor count", kind: "integer", minimum: 0 },
    {
      id: "reporterCount",
      label: "Reporter count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "targetReportersPerEditor",
      label: "Target reporters per editor",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "reportersPerEditor",
      label: "Reporters per editor",
      kind: "number",
      minimum: 0,
    },
    {
      id: "additionalEditorsNeeded",
      label: "Additional editors needed",
      kind: "number",
      minimum: 0,
    },
    {
      id: "meetsTarget",
      label: "Meets supplied staffing target",
      kind: "boolean",
    },
  ],
  title: "Editor Staffing Ratio",
});

export const run = tool.execute;
export default tool;
