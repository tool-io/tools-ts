import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly measuredGateSourceVoltageV: number;
  readonly measuredDrainCurrentA: number;
  readonly independentlyMeasuredIdssA: number;
}>;
export type Output = Readonly<{
  readonly inferredNchannelPinchOffVoltageV: number;
}>;
const inputFields = [
  {
    id: "measuredGateSourceVoltageV",
    label: "Measured gate source voltage v",
    kind: "number",
  },
  {
    id: "measuredDrainCurrentA",
    label: "Measured drain current a",
    kind: "number",
  },
  {
    id: "independentlyMeasuredIdssA",
    label: "Independently measured idss a",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredDrainCurrentA, "measuredDrainCurrentA");
  positive(input.independentlyMeasuredIdssA, "independentlyMeasuredIdssA");
  if (
    input.measuredGateSourceVoltageV >= 0 ||
    input.measuredDrainCurrentA >= input.independentlyMeasuredIdssA
  )
    simpleError(
      "operatingPoint",
      "Negative Vgs and Id strictly below Idss needed for n-channel Shockley inversion.",
    );
  return {
    inferredNchannelPinchOffVoltageV:
      input.measuredGateSourceVoltageV /
      (1 -
        Math.sqrt(
          input.measuredDrainCurrentA / input.independentlyMeasuredIdssA,
        )),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredGateSourceVoltageV: -1,
  measuredDrainCurrentA: 0.0025,
  independentlyMeasuredIdssA: 0.01,
} satisfies Input;
export const exampleOutput = {
  inferredNchannelPinchOffVoltageV: -2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/jfet-pinch-off-voltage",
  title: "Jfet Pinch Off Voltage Calculator",
  description:
    "Invert caller valid saturation-region n-channel Shockley observation for negative pinch-off voltage; not forward transconductance, device universal rating or applicability at cutoff/ohmic operation.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredNchannelPinchOffVoltageV",
      label: "Inferred nchannel pinch off voltage v",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredGateSourceVoltageV: value.measuredGateSourceVoltageV as number,
      measuredDrainCurrentA: value.measuredDrainCurrentA as number,
      independentlyMeasuredIdssA: value.independentlyMeasuredIdssA as number,
    }),
});
export const run = tool.execute;
export default tool;
