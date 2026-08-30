import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly factualErrorFixed: boolean;
  readonly materialNewReporting: boolean;
  readonly meaningClarified: boolean;
  readonly minorCopyEdit: boolean;
}>;
export type Output = Readonly<{
  readonly recommendedLabel: string;
  readonly materialChangeCount: number;
}>;

export const calculate = (input: Input): Output => {
  const materialChangeCount = [
    input.factualErrorFixed,
    input.materialNewReporting,
    input.meaningClarified,
  ].filter(Boolean).length;
  return {
    recommendedLabel: input.factualErrorFixed
      ? "correction"
      : input.materialNewReporting
        ? "update"
        : input.meaningClarified
          ? "clarification"
          : "no-label",
    materialChangeCount,
  };
};

export const exampleInput = {
  factualErrorFixed: false,
  materialNewReporting: true,
  meaningClarified: false,
  minorCopyEdit: false,
} satisfies Input;
export const exampleOutput = {
  recommendedLabel: "update",
  materialChangeCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      factualErrorFixed: input.factualErrorFixed as boolean,
      materialNewReporting: input.materialNewReporting as boolean,
      meaningClarified: input.meaningClarified as boolean,
      minorCopyEdit: input.minorCopyEdit as boolean,
    }),
  description: "Select an update label from supplied change characteristics.",
  id: "journalism/update-label-selector",
  inputs: [
    { id: "factualErrorFixed", label: "Factual error fixed", kind: "boolean" },
    {
      id: "materialNewReporting",
      label: "Material new reporting added",
      kind: "boolean",
    },
    { id: "meaningClarified", label: "Meaning clarified", kind: "boolean" },
    { id: "minorCopyEdit", label: "Minor copy edit", kind: "boolean" },
  ],
  outputs: [
    {
      id: "recommendedLabel",
      label: "Recommended update label",
      kind: "string",
      enum: ["correction", "update", "clarification", "no-label"],
    },
    {
      id: "materialChangeCount",
      label: "Material change count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Update Label Selector",
});

export const run = tool.execute;
export default tool;
