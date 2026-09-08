import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredDistancesKilometers: readonly number[];
  readonly callerCalibratedDecayScaleKilometers: number;
  readonly callerExclusionBufferKilometers: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredDistancesKilometers",
    label: "Independently measured distances kilometers",
    kind: "numberList",
  },
  {
    id: "callerCalibratedDecayScaleKilometers",
    label: "Caller calibrated decay scale kilometers",
    kind: "number",
  },
  {
    id: "callerExclusionBufferKilometers",
    label: "Caller exclusion buffer kilometers",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.independentlyMeasuredDistancesKilometers.forEach((v) =>
    nonnegative(v, "distance"),
  );
  positive(input.callerCalibratedDecayScaleKilometers, "scale");
  nonnegative(input.callerExclusionBufferKilometers, "buffer");
  return {
    conditionalRelativeDistanceWeights:
      input.independentlyMeasuredDistancesKilometers.map((v) =>
        v < input.callerExclusionBufferKilometers
          ? 0
          : Math.exp(-v / input.callerCalibratedDecayScaleKilometers),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredDistancesKilometers: [0, 1, 2],
    callerCalibratedDecayScaleKilometers: 1,
    callerExclusionBufferKilometers: 1,
  },
  output: {
    result: {
      conditionalRelativeDistanceWeights: [
        0, 0.36787944117144233, 0.1353352832366127,
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/journey-to-crime-distance-decay-buffer",
  title: "Journey To Crime Distance Decay Buffer Calculator",
  description:
    "Conditional distance-decay weights on independently measured distances with explicit below-buffer exclusion. Not geographic offender identification, normalized residence probability or police targeting recommendation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
