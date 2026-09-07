import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedThyristorOnStateV: readonly number[];
  readonly observedThyristorOnStateAmps: readonly number[];
  readonly callerIndependentlyEstablishedHoldingAmps: number;
}>;
export type Output = Readonly<{
  readonly measuredHoldingVoltageCrossingsV: readonly number[];
}>;
const inputFields = [
  {
    id: "observedThyristorOnStateV",
    label: "Observed thyristor on state v",
    kind: "numberList",
  },
  {
    id: "observedThyristorOnStateAmps",
    label: "Observed thyristor on state amps",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedHoldingAmps",
    label: "Caller independently established holding amps",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedThyristorOnStateV.forEach((v) =>
    nonnegative(v, "observedThyristorOnStateV"),
  );
  input.observedThyristorOnStateAmps.forEach((v) =>
    nonnegative(v, "observedThyristorOnStateAmps"),
  );
  nonnegative(
    input.callerIndependentlyEstablishedHoldingAmps,
    "callerIndependentlyEstablishedHoldingAmps",
  );
  return {
    measuredHoldingVoltageCrossingsV: crossings(
      input.observedThyristorOnStateV,
      input.observedThyristorOnStateAmps,
      input.callerIndependentlyEstablishedHoldingAmps,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedThyristorOnStateV: [0, 1, 2],
  observedThyristorOnStateAmps: [0, 2, 4],
  callerIndependentlyEstablishedHoldingAmps: 3,
} satisfies Input;
export const exampleOutput = {
  measuredHoldingVoltageCrossingsV: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/thyristor-holding-voltage",
  title: "Semiconductor Thyristor Holding Voltage Calculator",
  description:
    "Extract all actual piecewise-linear measuredHoldingVoltageCrossingsV test crossings at explicitly supplied callerIndependentlyEstablishedHoldingAmps, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredHoldingVoltageCrossingsV",
      label: "Measured holding voltage crossings v",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedThyristorOnStateV:
        value.observedThyristorOnStateV as readonly number[],
      observedThyristorOnStateAmps:
        value.observedThyristorOnStateAmps as readonly number[],
      callerIndependentlyEstablishedHoldingAmps:
        value.callerIndependentlyEstablishedHoldingAmps as number,
    }),
});
export const run = tool.execute;
export default tool;
