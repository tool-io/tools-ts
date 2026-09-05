import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerRmr89DryUnorientedRatings: readonly number[];
  readonly callerDryGroundwaterAndZeroOrientationVerified: boolean;
}>;
export type Output = Readonly<{
  readonly empiricalGsiFromRmr89: readonly number[];
}>;
const inputFields = [
  {
    id: "callerRmr89DryUnorientedRatings",
    label: "Caller rmr89 dry unoriented ratings",
    kind: "numberList",
  },
  {
    id: "callerDryGroundwaterAndZeroOrientationVerified",
    label: "Caller dry groundwater and zero orientation verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.callerDryGroundwaterAndZeroOrientationVerified)
    simpleError(
      "edition",
      "Independent RMR89 dry groundwater rating15 and zero orientation correction required.",
    );
  input.callerRmr89DryUnorientedRatings.forEach((v) =>
    bounded(v, "RMR89", 24, 100),
  );
  return {
    empiricalGsiFromRmr89: input.callerRmr89DryUnorientedRatings.map(
      (v) => v - 5,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRmr89DryUnorientedRatings: [50, 60],
  callerDryGroundwaterAndZeroOrientationVerified: true,
} satisfies Input;
export const exampleOutput = {
  empiricalGsiFromRmr89: [45, 55],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/gsi-from-rmr",
  title: "GSI From RMR Calculator",
  description:
    "Explicit empirical GSI≈RMR89−5 on caller independently verified RMR89 dry/unoriented branch and RMR>23 applicability (23 excluded), not universal all-edition conversion. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "empiricalGsiFromRmr89",
      label: "Empirical gsi from rmr89",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRmr89DryUnorientedRatings:
        value.callerRmr89DryUnorientedRatings as readonly number[],
      callerDryGroundwaterAndZeroOrientationVerified:
        value.callerDryGroundwaterAndZeroOrientationVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
