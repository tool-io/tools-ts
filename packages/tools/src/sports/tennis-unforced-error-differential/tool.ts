import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPlayerUnforcedErrors: readonly number[];
  readonly observedOpponentUnforcedErrors: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedPlayerMinusOpponentErrors: readonly number[];
  readonly totalSignedErrorDifferential: number;
}>;
const inputFields = [
  {
    id: "observedPlayerUnforcedErrors",
    label: "Observed player unforced errors",
    kind: "numberList",
  },
  {
    id: "observedOpponentUnforcedErrors",
    label: "Observed opponent unforced errors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedPlayerUnforcedErrors,
    input.observedOpponentUnforcedErrors,
    "matches",
  );
  [
    ...input.observedPlayerUnforcedErrors,
    ...input.observedOpponentUnforcedErrors,
  ].forEach((v) => bounded(v, "errors", 0, 1000000));
  const differences = input.observedPlayerUnforcedErrors.map(
    (v, i) => v - input.observedOpponentUnforcedErrors[i],
  );
  return {
    signedPlayerMinusOpponentErrors: differences,
    totalSignedErrorDifferential: sum(differences),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlayerUnforcedErrors: [10, 20],
  observedOpponentUnforcedErrors: [12, 15],
} satisfies Input;
export const exampleOutput = {
  signedPlayerMinusOpponentErrors: [-2, 5],
  totalSignedErrorDifferential: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/tennis-unforced-error-differential",
  title: "Unforced Error Differential Calculator",
  description:
    "Audit actual tennis unforced-error annotation pairs, signed positive means more player errors; no score outcome, forced-error or causal skill inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPlayerMinusOpponentErrors",
      label: "Signed player minus opponent errors",
      kind: "numberList",
    },
    {
      id: "totalSignedErrorDifferential",
      label: "Total signed error differential",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlayerUnforcedErrors:
        value.observedPlayerUnforcedErrors as readonly number[],
      observedOpponentUnforcedErrors:
        value.observedOpponentUnforcedErrors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
