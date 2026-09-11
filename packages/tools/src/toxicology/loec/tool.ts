import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  nonnegative,
  strictlyIncreasing,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTestedConcentrations: readonly number[];
  readonly independentlyAssessedSignificantEffectFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTestedConcentrations",
    label: "Actual tested concentrations",
    kind: "numberList",
  },
  {
    id: "independentlyAssessedSignificantEffectFlags",
    label: "Independently assessed significant effect flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualTestedConcentrations,
    input.independentlyAssessedSignificantEffectFlags,
    "tests",
  );
  strictlyIncreasing(input.actualTestedConcentrations, "concentrations", 2);
  input.actualTestedConcentrations.forEach((v) =>
    nonnegative(v, "concentration"),
  );
  binary(input.independentlyAssessedSignificantEffectFlags, "tests");
  const i = input.independentlyAssessedSignificantEffectFlags.indexOf(1);
  if (i < 0)
    simpleError(
      "effect",
      "Untested endpoint:no observed significant effect; no LOECinferred.",
    );
  return {
    lowestObservedEffectConcentration: input.actualTestedConcentrations[i],
    nonmonotoneSignificantEffectEvidence:
      input.independentlyAssessedSignificantEffectFlags
        .slice(i + 1)
        .includes(0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTestedConcentrations: [1, 2, 3],
    independentlyAssessedSignificantEffectFlags: [0, 1, 0],
  },
  output: {
    result: {
      lowestObservedEffectConcentration: 2,
      nonmonotoneSignificantEffectEvidence: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/loec",
  title: "LOEC Calculator",
  description:
    "First actual independently significant tested concentration LOEC, retaining nonmonotone significance. This does not calculate pvalues, establish NOEC, true biological threshold or safe exposure.",
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
