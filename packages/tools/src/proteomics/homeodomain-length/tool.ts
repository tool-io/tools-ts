import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly minimumLength: number;
  readonly maximumLength: number;
}>;
export type Output = Readonly<{
  readonly domainLength: number;
  readonly withinRange: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (input.minimumLength < 1 || input.maximumLength < input.minimumLength)
    simpleError(
      "minimumLength",
      "Positive ordered domain length bounds required.",
    );
  return {
    domainLength: s.length,
    withinRange:
      s.length >= input.minimumLength && s.length <= input.maximumLength,
  };
};
export const exampleInput = {
  sequence: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  minimumLength: 55,
  maximumLength: 65,
} satisfies Input;
export const exampleOutput = {
  domainLength: 60,
  withinRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/homeodomain-length",
  title: "Homeodomain Length",
  description:
    "Check a predicted homeodomain against caller-supplied length bounds.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "minimumLength", label: "Minimum length", kind: "number" },
    { id: "maximumLength", label: "Maximum length", kind: "number" },
  ],
  outputs: [
    { id: "domainLength", label: "Domain length", kind: "number" },
    { id: "withinRange", label: "Within range", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      minimumLength: value.minimumLength as number,
      maximumLength: value.maximumLength as number,
    }),
});
export const run = tool.execute;
export default tool;
