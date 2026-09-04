import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerLifeCycleActivityAmounts: readonly number[];
  readonly callerMatchedEmissionFactorsKgCo2e: readonly number[];
  readonly callerIndependentStoredCo2eKg: number;
}>;
export type Output = Readonly<{
  readonly signedBoundaryLifeCycleCo2eKg: number;
}>;
const inputFields = [
  {
    id: "callerLifeCycleActivityAmounts",
    label: "Caller life cycle activity amounts",
    kind: "numberList",
  },
  {
    id: "callerMatchedEmissionFactorsKgCo2e",
    label: "Caller matched emission factors kg co2e",
    kind: "numberList",
  },
  {
    id: "callerIndependentStoredCo2eKg",
    label: "Caller independent stored co2e kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerLifeCycleActivityAmounts.forEach((v) =>
    nonnegative(v, "callerLifeCycleActivityAmounts"),
  );
  input.callerMatchedEmissionFactorsKgCo2e.forEach((v) =>
    nonnegative(v, "callerMatchedEmissionFactorsKgCo2e"),
  );
  nonnegative(
    input.callerIndependentStoredCo2eKg,
    "callerIndependentStoredCo2eKg",
  );
  aligned(
    input.callerLifeCycleActivityAmounts,
    input.callerMatchedEmissionFactorsKgCo2e,
    "callerLifeCycleActivityAmounts",
  );
  return {
    signedBoundaryLifeCycleCo2eKg:
      sum(
        input.callerLifeCycleActivityAmounts.map(
          (v, i) => v * input.callerMatchedEmissionFactorsKgCo2e[i],
        ),
      ) - input.callerIndependentStoredCo2eKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLifeCycleActivityAmounts: [2, 3],
  callerMatchedEmissionFactorsKgCo2e: [1, 2],
  callerIndependentStoredCo2eKg: 1,
} satisfies Input;
export const exampleOutput = {
  signedBoundaryLifeCycleCo2eKg: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/lca-carbon-footprint",
  title: "LCA Carbon Footprint Calculator",
  description:
    "Declared life-cycle boundary gross inventories minus independently accounted storage, not per-product agriculture footprint or verified offsets. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedBoundaryLifeCycleCo2eKg",
      label: "Signed boundary life cycle co2e kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLifeCycleActivityAmounts:
        value.callerLifeCycleActivityAmounts as readonly number[],
      callerMatchedEmissionFactorsKgCo2e:
        value.callerMatchedEmissionFactorsKgCo2e as readonly number[],
      callerIndependentStoredCo2eKg:
        value.callerIndependentStoredCo2eKg as number,
    }),
});
export const run = tool.execute;
export default tool;
