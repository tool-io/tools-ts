import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualMixtureConcentrations: readonly number[];
  readonly callerVerifiedMatchedEndpointConcentrations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMixtureConcentrations",
    label: "Actual mixture concentrations",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMatchedEndpointConcentrations",
    label: "Caller verified matched endpoint concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualMixtureConcentrations,
    input.callerVerifiedMatchedEndpointConcentrations,
    "components",
  );
  input.actualMixtureConcentrations.forEach((v) =>
    nonnegative(v, "concentration"),
  );
  input.callerVerifiedMatchedEndpointConcentrations.forEach((v) =>
    positive(v, "endpoint"),
  );
  const t = input.actualMixtureConcentrations.map(
    (v, i) => v / input.callerVerifiedMatchedEndpointConcentrations[i],
  );
  return {
    observedComponentToxicUnits: t,
    conditionalConcentrationAdditionToxicUnits: sum(t),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMixtureConcentrations: [1, 2],
    callerVerifiedMatchedEndpointConcentrations: [2, 4],
  },
  output: {
    result: {
      observedComponentToxicUnits: [0.5, 0.5],
      conditionalConcentrationAdditionToxicUnits: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/toxic-units-mixture",
  title: "Toxic Units Mixture Calculator",
  description:
    "Actual mixture concentration/independently verified compatible single-component endpoint toxic units, summed only under declared concentration-addition/common-endpoint assumptions. Not the existing Hillresponse curve, independent-action model or mixture hazard certification.",
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
