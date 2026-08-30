import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly copy: string;
  readonly requiredSeparator: string;
}>;
export type Output = Readonly<{
  readonly asciiSeparatorCount: number;
  readonly multiplicationSeparatorCount: number;
  readonly usesRequiredSeparator: boolean;
}>;

export const calculate = (input: Input): Output => {
  const asciiSeparatorCount = (input.copy.match(/(?<=\d)\s*x\s*(?=\d)/gi) ?? [])
    .length;
  const multiplicationSeparatorCount = (
    input.copy.match(/(?<=\d)\s*×\s*(?=\d)/g) ?? []
  ).length;
  const usesRequiredSeparator =
    input.requiredSeparator === "x"
      ? asciiSeparatorCount > 0 && multiplicationSeparatorCount === 0
      : multiplicationSeparatorCount > 0 && asciiSeparatorCount === 0;
  return {
    asciiSeparatorCount,
    multiplicationSeparatorCount,
    usesRequiredSeparator,
  };
};

export const exampleInput = {
  copy: "The panel is 12 × 8 inches.",
  requiredSeparator: "×",
} satisfies Input;
export const exampleOutput = {
  asciiSeparatorCount: 0,
  multiplicationSeparatorCount: 1,
  usesRequiredSeparator: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      copy: input.copy as string,
      requiredSeparator: input.requiredSeparator as string,
    }),
  description: "Check dimension separators in copy.",
  id: "journalism/dimension-mark-check",
  inputs: [
    { id: "copy", label: "Copy containing dimensions", kind: "string" },
    {
      id: "requiredSeparator",
      label: "Required dimension separator",
      kind: "string",
      enum: ["x", "×"],
    },
  ],
  outputs: [
    {
      id: "asciiSeparatorCount",
      label: "ASCII dimension separators",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "multiplicationSeparatorCount",
      label: "Multiplication-sign separators",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "usesRequiredSeparator",
      label: "Uses only the required separator",
      kind: "boolean",
    },
  ],
  title: "Dimension Mark Check",
});

export const run = tool.execute;
export default tool;
