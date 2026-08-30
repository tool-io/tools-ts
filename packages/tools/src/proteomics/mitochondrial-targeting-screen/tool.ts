import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly nTerminalLength: number;
  readonly minimumBasicFraction: number;
  readonly maximumAcidicFraction: number;
}>;
export type Output = Readonly<{
  readonly basicFraction: number;
  readonly acidicFraction: number;
  readonly candidate: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.nTerminalLength) ||
    input.nTerminalLength < 1 ||
    input.nTerminalLength > s.length
  )
    simpleError("nTerminalLength", "Valid N-terminal segment length required.");
  const region = s.slice(0, input.nTerminalLength),
    basicFraction =
      [...region].filter((v) => "KR".includes(v)).length / region.length,
    acidicFraction =
      [...region].filter((v) => "DE".includes(v)).length / region.length;
  return {
    basicFraction,
    acidicFraction,
    candidate:
      basicFraction >= input.minimumBasicFraction &&
      acidicFraction <= input.maximumAcidicFraction,
  };
};
export const exampleInput = {
  sequence: "KKAA",
  nTerminalLength: 4,
  minimumBasicFraction: 0.4,
  maximumAcidicFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  basicFraction: 0.5,
  acidicFraction: 0,
  candidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/mitochondrial-targeting-screen",
  title: "Mitochondrial Targeting Screen",
  description:
    "Screen N-terminal mitochondrial targeting composition; not a localization verdict.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "nTerminalLength", label: "N terminal length", kind: "number" },
    {
      id: "minimumBasicFraction",
      label: "Minimum basic fraction",
      kind: "number",
    },
    {
      id: "maximumAcidicFraction",
      label: "Maximum acidic fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "basicFraction", label: "Basic fraction", kind: "number" },
    { id: "acidicFraction", label: "Acidic fraction", kind: "number" },
    { id: "candidate", label: "Candidate", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      nTerminalLength: value.nTerminalLength as number,
      minimumBasicFraction: value.minimumBasicFraction as number,
      maximumAcidicFraction: value.maximumAcidicFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
