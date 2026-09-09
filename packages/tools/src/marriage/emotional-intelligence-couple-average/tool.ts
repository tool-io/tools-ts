import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly firstIndependentlyEstablishedSameInstrumentScore: number;
  readonly secondIndependentlyEstablishedSameInstrumentScore: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "firstIndependentlyEstablishedSameInstrumentScore",
    label: "First independently established same instrument score",
    kind: "number",
  },
  {
    id: "secondIndependentlyEstablishedSameInstrumentScore",
    label: "Second independently established same instrument score",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    observedPairArithmeticMean:
      (input.firstIndependentlyEstablishedSameInstrumentScore +
        input.secondIndependentlyEstablishedSameInstrumentScore) /
      2,
    signedPairScoreDifference:
      input.firstIndependentlyEstablishedSameInstrumentScore -
      input.secondIndependentlyEstablishedSameInstrumentScore,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    firstIndependentlyEstablishedSameInstrumentScore: 10,
    secondIndependentlyEstablishedSameInstrumentScore: 20,
  },
  output: {
    result: { observedPairArithmeticMean: 15, signedPairScoreDifference: -10 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/emotional-intelligence-couple-average",
  title: "Couple Emotional Intelligence Average Calculator",
  description:
    "Actual same-instrument emotional-intelligence pair arithmetic summary, not validated couple emotional intelligence, compatibility, norm cutoff or interpersonal efficacy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
