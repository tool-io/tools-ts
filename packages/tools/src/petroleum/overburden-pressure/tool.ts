import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integral,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOverburdenDepthsM: readonly number[];
  readonly observedMatchedBulkDensityKgM3: readonly number[];
  readonly callerGravityMSecond2: number;
  readonly callerIndependentlyEstablishedTopStressPa: number;
}>;
export type Output = Readonly<{
  readonly integratedObservedVerticalStressPa: number;
}>;
const inputFields = [
  {
    id: "observedOverburdenDepthsM",
    label: "Observed overburden depths m",
    kind: "numberList",
  },
  {
    id: "observedMatchedBulkDensityKgM3",
    label: "Observed matched bulk density kg m3",
    kind: "numberList",
  },
  {
    id: "callerGravityMSecond2",
    label: "Caller gravity m second2",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedTopStressPa",
    label: "Caller independently established top stress pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedBulkDensityKgM3.forEach((v) =>
    positive(v, "observedMatchedBulkDensityKgM3"),
  );
  positive(input.callerGravityMSecond2, "callerGravityMSecond2");
  input.observedOverburdenDepthsM.forEach((v) =>
    nonnegative(v, "observedOverburdenDepthsM"),
  );
  nonnegative(
    input.callerIndependentlyEstablishedTopStressPa,
    "callerIndependentlyEstablishedTopStressPa",
  );
  return {
    integratedObservedVerticalStressPa:
      input.callerIndependentlyEstablishedTopStressPa +
      input.callerGravityMSecond2 *
        integral(
          input.observedOverburdenDepthsM,
          input.observedMatchedBulkDensityKgM3,
        ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOverburdenDepthsM: [0, 1, 3],
  observedMatchedBulkDensityKgM3: [2, 4, 4],
  callerGravityMSecond2: 10,
  callerIndependentlyEstablishedTopStressPa: 5,
} satisfies Input;
export const exampleOutput = {
  integratedObservedVerticalStressPa: 115,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/overburden-pressure",
  title: "Petroleum Overburden Pressure Calculator",
  description:
    "Integrate actual depth-dependent overburden density and independent top stress, not single-fluid hydrostaticρgh or inferred geologic density log. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "integratedObservedVerticalStressPa",
      label: "Integrated observed vertical stress pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOverburdenDepthsM:
        value.observedOverburdenDepthsM as readonly number[],
      observedMatchedBulkDensityKgM3:
        value.observedMatchedBulkDensityKgM3 as readonly number[],
      callerGravityMSecond2: value.callerGravityMSecond2 as number,
      callerIndependentlyEstablishedTopStressPa:
        value.callerIndependentlyEstablishedTopStressPa as number,
    }),
});
export const run = tool.execute;
export default tool;
