import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAlphabetSymbolCount: number;
  readonly callerCodonLength: number;
  readonly callerRequiredDistinctMeaningCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedAlphabetSymbolCount",
    label: "Caller verified alphabet symbol count",
    kind: "number",
  },
  { id: "callerCodonLength", label: "Caller codon length", kind: "number" },
  {
    id: "callerRequiredDistinctMeaningCount",
    label: "Caller required distinct meaning count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerVerifiedAlphabetSymbolCount, "alphabet", 2, 32);
  bounded(input.callerCodonLength, "length", 1, 10);
  bounded(input.callerRequiredDistinctMeaningCount, "meanings", 1, 1000000);
  const c = input.callerVerifiedAlphabetSymbolCount ** input.callerCodonLength;
  return {
    conditionalCodonCapacity: c,
    conditionalMaximumBitsPerCodon:
      input.callerCodonLength *
      Math.log2(input.callerVerifiedAlphabetSymbolCount),
    minimumCodewordsForMeanings: input.callerRequiredDistinctMeaningCount,
    capacitySupportsStatedMeaningCount:
      c >= input.callerRequiredDistinctMeaningCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedAlphabetSymbolCount: 4,
    callerCodonLength: 3,
    callerRequiredDistinctMeaningCount: 20,
  },
  output: {
    result: {
      conditionalCodonCapacity: 64,
      conditionalMaximumBitsPerCodon: 6,
      minimumCodewordsForMeanings: 20,
      capacitySupportsStatedMeaningCount: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/minimal-genetic-code-information-bits",
  title: "Genetic Code Minimal Codon Set Information Bits Calculator",
  description:
    "Conditional combinatorial code capacity alphabet^length and maximum equiprobable bits; distinct meanings each require a codeword under declared injective scheme. Not actual genetic-code entropy, minimal viable genes or code evolvability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
