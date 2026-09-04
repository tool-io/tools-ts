import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sum,
  shape,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerTemporaryLoadCaseMagnitudesN: readonly (readonly number[])[];
  readonly callerIndependentCombinationFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerCombinedCaseLoadsN: readonly number[];
}>;
const inputFields = [
  {
    id: "callerTemporaryLoadCaseMagnitudesN",
    label: "Caller temporary load case magnitudes n",
    kind: "matrix",
  },
  {
    id: "callerIndependentCombinationFactors",
    label: "Caller independent combination factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const width = shape(input.callerTemporaryLoadCaseMagnitudesN, "cases");
  if (width !== input.callerIndependentCombinationFactors.length)
    simpleError(
      "factors",
      "Explicit matching load columns and caller factors.",
    );
  input.callerIndependentCombinationFactors.forEach((v) =>
    nonnegative(v, "factor"),
  );
  return {
    callerCombinedCaseLoadsN: input.callerTemporaryLoadCaseMagnitudesN.map(
      (row) =>
        sum(
          row.map((v, i) => v * input.callerIndependentCombinationFactors[i]),
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTemporaryLoadCaseMagnitudesN: [
    [1, 2],
    [3, 4],
  ],
  callerIndependentCombinationFactors: [2, 1],
} satisfies Input;
export const exampleOutput = {
  callerCombinedCaseLoadsN: [4, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/temporary-works-load",
  title: "Temporary Works Load Calculator",
  description:
    "Apply independently established load-combination factors to signed temporary-works case vectors, no code/default combinations or structural capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCombinedCaseLoadsN",
      label: "Caller combined case loads n",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTemporaryLoadCaseMagnitudesN:
        value.callerTemporaryLoadCaseMagnitudesN as readonly (readonly number[])[],
      callerIndependentCombinationFactors:
        value.callerIndependentCombinationFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
