import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyVerifiedPillarStrengthMpa: readonly number[];
  readonly observedMatchedPillarStressesMpa: readonly number[];
  readonly callerRequiredStrengthStressRatios: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedStrengthStressRatios: readonly number[];
  readonly signedCallerRatioMargins: readonly number[];
}>;
const inputFields = [
  {
    id: "callerIndependentlyVerifiedPillarStrengthMpa",
    label: "Caller independently verified pillar strength mpa",
    kind: "numberList",
  },
  {
    id: "observedMatchedPillarStressesMpa",
    label: "Observed matched pillar stresses mpa",
    kind: "numberList",
  },
  {
    id: "callerRequiredStrengthStressRatios",
    label: "Caller required strength stress ratios",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndependentlyVerifiedPillarStrengthMpa.forEach((v) =>
    positive(v, "callerIndependentlyVerifiedPillarStrengthMpa"),
  );
  input.observedMatchedPillarStressesMpa.forEach((v) =>
    positive(v, "observedMatchedPillarStressesMpa"),
  );
  input.callerRequiredStrengthStressRatios.forEach((v) =>
    positive(v, "callerRequiredStrengthStressRatios"),
  );
  aligned(
    input.callerIndependentlyVerifiedPillarStrengthMpa,
    input.observedMatchedPillarStressesMpa,
    "callerIndependentlyVerifiedPillarStrengthMpa",
  );
  aligned(
    input.callerIndependentlyVerifiedPillarStrengthMpa,
    input.callerRequiredStrengthStressRatios,
    "callerIndependentlyVerifiedPillarStrengthMpa",
  );
  const ratio = input.callerIndependentlyVerifiedPillarStrengthMpa.map(
    (v, i) => v / input.observedMatchedPillarStressesMpa[i],
  );
  return {
    observedStrengthStressRatios: ratio,
    signedCallerRatioMargins: ratio.map(
      (v, i) => v - input.callerRequiredStrengthStressRatios[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentlyVerifiedPillarStrengthMpa: [10, 20],
  observedMatchedPillarStressesMpa: [5, 25],
  callerRequiredStrengthStressRatios: [2, 2],
} satisfies Input;
export const exampleOutput = {
  observedStrengthStressRatios: [2, 0.8],
  signedCallerRatioMargins: [0, -1.2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pillar-safety-factor",
  title: "Pillar Safety Factor Calculator",
  description:
    "Audit independently verified pillar strength and measured stress margins, not empirical geometry-based pillar strength or an actual safety-factor certification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedStrengthStressRatios",
      label: "Observed strength stress ratios",
      kind: "numberList",
    },
    {
      id: "signedCallerRatioMargins",
      label: "Signed caller ratio margins",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentlyVerifiedPillarStrengthMpa:
        value.callerIndependentlyVerifiedPillarStrengthMpa as readonly number[],
      observedMatchedPillarStressesMpa:
        value.observedMatchedPillarStressesMpa as readonly number[],
      callerRequiredStrengthStressRatios:
        value.callerRequiredStrengthStressRatios as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
