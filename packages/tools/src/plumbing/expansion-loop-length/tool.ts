import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedExpansionLoopLegLengthsM: readonly number[];
  readonly callerMatchedAllowableMovementsMm: readonly number[];
  readonly observedRequiredPipeMovementMm: number;
}>;
export type Output = Readonly<{
  readonly minimumVerifiedExpansionLoopLegM: number;
  readonly callerMovementWithinVerifiedCatalog: boolean;
}>;
const inputFields = [
  {
    id: "callerVerifiedExpansionLoopLegLengthsM",
    label: "Caller verified expansion loop leg lengths m",
    kind: "numberList",
  },
  {
    id: "callerMatchedAllowableMovementsMm",
    label: "Caller matched allowable movements mm",
    kind: "numberList",
  },
  {
    id: "observedRequiredPipeMovementMm",
    label: "Observed required pipe movement mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedExpansionLoopLegLengthsM.forEach((v) =>
    positive(v, "callerVerifiedExpansionLoopLegLengthsM"),
  );
  input.callerMatchedAllowableMovementsMm.forEach((v) =>
    nonnegative(v, "callerMatchedAllowableMovementsMm"),
  );
  nonnegative(
    input.observedRequiredPipeMovementMm,
    "observedRequiredPipeMovementMm",
  );
  aligned(
    input.callerVerifiedExpansionLoopLegLengthsM,
    input.callerMatchedAllowableMovementsMm,
    "callerVerifiedExpansionLoopLegLengthsM",
  );
  strictlyIncreasing(input.callerVerifiedExpansionLoopLegLengthsM, "legs", 1);
  const i = input.callerMatchedAllowableMovementsMm.findIndex(
    (v) => v >= input.observedRequiredPipeMovementMm,
  );
  return {
    minimumVerifiedExpansionLoopLegM:
      i < 0 ? -1 : input.callerVerifiedExpansionLoopLegLengthsM[i],
    callerMovementWithinVerifiedCatalog: i >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedExpansionLoopLegLengthsM: [1, 2, 3],
  callerMatchedAllowableMovementsMm: [5, 15, 25],
  observedRequiredPipeMovementMm: 10,
} satisfies Input;
export const exampleOutput = {
  minimumVerifiedExpansionLoopLegM: 2,
  callerMovementWithinVerifiedCatalog: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/expansion-loop-length",
  title: "Plumbing Expansion Loop Length Calculator",
  description:
    "Read actual independently verified matched material/diameter/flexibility expansion-loop movement catalog; no guessed bending-stress formula, scalar thermal expansion or anchoring approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumVerifiedExpansionLoopLegM",
      label: "Minimum verified expansion loop leg m",
      kind: "number",
    },
    {
      id: "callerMovementWithinVerifiedCatalog",
      label: "Caller movement within verified catalog",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedExpansionLoopLegLengthsM:
        value.callerVerifiedExpansionLoopLegLengthsM as readonly number[],
      callerMatchedAllowableMovementsMm:
        value.callerMatchedAllowableMovementsMm as readonly number[],
      observedRequiredPipeMovementMm:
        value.observedRequiredPipeMovementMm as number,
    }),
});
export const run = tool.execute;
export default tool;
