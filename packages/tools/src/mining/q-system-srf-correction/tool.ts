import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBaseQWithoutSrf: readonly number[];
  readonly callerIndependentlyAssignedStressReductionFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly srfCorrectedCallerQ: readonly number[];
}>;
const inputFields = [
  {
    id: "callerVerifiedBaseQWithoutSrf",
    label: "Caller verified base q without srf",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyAssignedStressReductionFactors",
    label: "Caller independently assigned stress reduction factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedBaseQWithoutSrf.forEach((v) =>
    positive(v, "callerVerifiedBaseQWithoutSrf"),
  );
  input.callerIndependentlyAssignedStressReductionFactors.forEach((v) =>
    positive(v, "callerIndependentlyAssignedStressReductionFactors"),
  );
  aligned(
    input.callerVerifiedBaseQWithoutSrf,
    input.callerIndependentlyAssignedStressReductionFactors,
    "callerVerifiedBaseQWithoutSrf",
  );
  return {
    srfCorrectedCallerQ: input.callerVerifiedBaseQWithoutSrf.map(
      (v, i) => v / input.callerIndependentlyAssignedStressReductionFactors[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBaseQWithoutSrf: [10, 20],
  callerIndependentlyAssignedStressReductionFactors: [2, 4],
} satisfies Input;
export const exampleOutput = { srfCorrectedCallerQ: [5, 5] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/q-system-srf-correction",
  title: "Q-System SRF Correction Calculator",
  description:
    "Apply explicit Q stress-reduction divisor to independently established baseRQD/Jn×Jr/Ja×Jw, no inferred SRF, full Q from photographs or ground-support prescription. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "srfCorrectedCallerQ",
      label: "Srf corrected caller q",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedBaseQWithoutSrf:
        value.callerVerifiedBaseQWithoutSrf as readonly number[],
      callerIndependentlyAssignedStressReductionFactors:
        value.callerIndependentlyAssignedStressReductionFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
