import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  binary,
  sum,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerPrincipleWeights: readonly number[];
  readonly independentlyAssessedPrincipleScores: readonly number[];
  readonly principleKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerPrincipleWeights",
    label: "Caller principle weights",
    kind: "numberList",
  },
  {
    id: "independentlyAssessedPrincipleScores",
    label: "Independently assessed principle scores",
    kind: "numberList",
  },
  {
    id: "principleKnownFlags",
    label: "Principle known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.callerPrincipleWeights.length !== 5)
    simpleError(
      "principles",
      "Five columns:simplicity, symbolism, colour limit, no lettering/seals, distinctiveness/relatedness.",
    );
  aligned(
    input.callerPrincipleWeights,
    input.independentlyAssessedPrincipleScores,
    "scores",
  );
  aligned(input.callerPrincipleWeights, input.principleKnownFlags, "known");
  input.callerPrincipleWeights.forEach((v) => nonnegative(v, "weight"));
  input.independentlyAssessedPrincipleScores.forEach((v) =>
    fraction(v, "score"),
  );
  binary(input.principleKnownFlags, "known");
  const t = positive(sum(input.callerPrincipleWeights), "totalweight");
  return {
    weightedKnownScore:
      sum(
        input.callerPrincipleWeights.map(
          (v, i) =>
            v *
            input.independentlyAssessedPrincipleScores[i] *
            input.principleKnownFlags[i],
        ),
      ) / t,
    unknownWeightFraction:
      sum(
        input.callerPrincipleWeights.map(
          (v, i) => v * (1 - input.principleKnownFlags[i]),
        ),
      ) / t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerPrincipleWeights: [1, 1, 1, 1, 1],
    independentlyAssessedPrincipleScores: [1, 0.5, 1, 0, 0.5],
    principleKnownFlags: [1, 1, 1, 1, 0],
  },
  output: { result: { weightedKnownScore: 0.5, unknownWeightFraction: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/nava-principle-scorer",
  title: "NAVA Good Flag Principle Scorer",
  description:
    "Caller weighted evidence score for NAVAG ood Flag, Bad Flag five principles; scores require independent judgement, unknown weight retained. Not official rating, automatic image analysis or universal design quality.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
