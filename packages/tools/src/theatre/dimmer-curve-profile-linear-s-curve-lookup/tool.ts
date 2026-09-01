import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  interpolate,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerObservedControlFractions: readonly number[];
  readonly callerObservedLightOutputFractions: readonly number[];
  readonly queryControlFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly interpolatedMeasuredDimmerOutputs: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedControlFractions",
    label: "Caller observed control fractions",
    kind: "numberList",
  },
  {
    id: "callerObservedLightOutputFractions",
    label: "Caller observed light output fractions",
    kind: "numberList",
  },
  {
    id: "queryControlFractions",
    label: "Query control fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerObservedControlFractions.forEach((v) =>
    fraction(v, "callerObservedControlFractions"),
  );
  input.callerObservedLightOutputFractions.forEach((v) =>
    fraction(v, "callerObservedLightOutputFractions"),
  );
  input.queryControlFractions.forEach((v) =>
    fraction(v, "queryControlFractions"),
  );
  aligned(
    input.callerObservedControlFractions,
    input.callerObservedLightOutputFractions,
    "callerObservedControlFractions",
  );
  if (
    input.callerObservedLightOutputFractions.some(
      (v, i) => i > 0 && v < input.callerObservedLightOutputFractions[i - 1],
    )
  )
    simpleError("curve", "Nondecreasing measured dimmer output required.");
  return {
    interpolatedMeasuredDimmerOutputs: input.queryControlFractions.map((q) =>
      interpolate(
        input.callerObservedControlFractions,
        input.callerObservedLightOutputFractions,
        q,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedControlFractions: [0, 0.5, 1],
  callerObservedLightOutputFractions: [0, 0.25, 1],
  queryControlFractions: [0.25, 0.75],
} satisfies Input;
export const exampleOutput = {
  interpolatedMeasuredDimmerOutputs: [0.125, 0.625],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/dimmer-curve-profile-linear-s-curve-lookup",
  title: "Dimmer Curve Profile Linear S-Curve Lookup",
  description:
    "Read actual caller measured dimmer control-to-light curve rather than inventing generic S-curve calibration; no voltage-power equivalence, lamp thermal response or console profile upload.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedMeasuredDimmerOutputs",
      label: "Interpolated measured dimmer outputs",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedControlFractions:
        value.callerObservedControlFractions as readonly number[],
      callerObservedLightOutputFractions:
        value.callerObservedLightOutputFractions as readonly number[],
      queryControlFractions: value.queryControlFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
