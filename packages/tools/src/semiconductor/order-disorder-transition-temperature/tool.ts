import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedOrderDisorderTemperatureKelvin: readonly number[];
  readonly observedOrderParameterMagnitude: readonly number[];
  readonly callerTransitionOrderMagnitude: number;
}>;
export type Output = Readonly<{
  readonly measuredOrderTransitionTemperatureCrossingsKelvin: readonly number[];
}>;
const inputFields = [
  {
    id: "observedOrderDisorderTemperatureKelvin",
    label: "Observed order disorder temperature kelvin",
    kind: "numberList",
  },
  {
    id: "observedOrderParameterMagnitude",
    label: "Observed order parameter magnitude",
    kind: "numberList",
  },
  {
    id: "callerTransitionOrderMagnitude",
    label: "Caller transition order magnitude",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOrderDisorderTemperatureKelvin.forEach((v) =>
    nonnegative(v, "observedOrderDisorderTemperatureKelvin"),
  );
  input.observedOrderParameterMagnitude.forEach((v) =>
    nonnegative(v, "observedOrderParameterMagnitude"),
  );
  nonnegative(
    input.callerTransitionOrderMagnitude,
    "callerTransitionOrderMagnitude",
  );
  return {
    measuredOrderTransitionTemperatureCrossingsKelvin: crossings(
      input.observedOrderDisorderTemperatureKelvin,
      input.observedOrderParameterMagnitude,
      input.callerTransitionOrderMagnitude,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOrderDisorderTemperatureKelvin: [0, 1, 2],
  observedOrderParameterMagnitude: [0, 2, 4],
  callerTransitionOrderMagnitude: 3,
} satisfies Input;
export const exampleOutput = {
  measuredOrderTransitionTemperatureCrossingsKelvin: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/order-disorder-transition-temperature",
  title: "Semiconductor Order Disorder Transition Temperature Calculator",
  description:
    "Extract all actual piecewise-linear measuredOrderTransitionTemperatureCrossingsKelvin test crossings at explicitly supplied callerTransitionOrderMagnitude, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredOrderTransitionTemperatureCrossingsKelvin",
      label: "Measured order transition temperature crossings kelvin",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOrderDisorderTemperatureKelvin:
        value.observedOrderDisorderTemperatureKelvin as readonly number[],
      observedOrderParameterMagnitude:
        value.observedOrderParameterMagnitude as readonly number[],
      callerTransitionOrderMagnitude:
        value.callerTransitionOrderMagnitude as number,
    }),
});
export const run = tool.execute;
export default tool;
