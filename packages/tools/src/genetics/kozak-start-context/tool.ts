import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, dna } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly startCodonIndex: number;
}>;
export type Output = Readonly<{
  readonly minusThreeBase: string;
  readonly plusFourBase: string;
  readonly contextStrength: string;
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence);
  count(input.startCodonIndex, "startCodonIndex", 3);
  if (
    s.slice(input.startCodonIndex, input.startCodonIndex + 3) !== "ATG" ||
    input.startCodonIndex + 3 >= s.length
  )
    simpleError(
      "startCodonIndex",
      "ATG start with bases at minus-three and plus-four required.",
    );
  const minusThreeBase = s[input.startCodonIndex - 3],
    plusFourBase = s[input.startCodonIndex + 3],
    score =
      Number("AG".includes(minusThreeBase)) + Number(plusFourBase === "G");
  return {
    minusThreeBase,
    plusFourBase,
    contextStrength:
      score === 2 ? "strong" : score === 1 ? "intermediate" : "weak",
  };
};
export const exampleInput = {
  sequence: "GCCACCATGG",
  startCodonIndex: 6,
} satisfies Input;
export const exampleOutput = {
  minusThreeBase: "A",
  plusFourBase: "G",
  contextStrength: "strong",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/kozak-start-context",
  title: "Kozak Start Context",
  description:
    "Rate Kozak context from the minus-three purine and plus-four G surrounding a specified ATG.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "startCodonIndex", label: "Start codon index", kind: "integer" },
  ],
  outputs: [
    { id: "minusThreeBase", label: "Minus three base", kind: "string" },
    { id: "plusFourBase", label: "Plus four base", kind: "string" },
    { id: "contextStrength", label: "Context strength", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      startCodonIndex: value.startCodonIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
