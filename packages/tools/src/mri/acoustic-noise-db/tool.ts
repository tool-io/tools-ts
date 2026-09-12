import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  mean,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCalibratedRmsAcousticPressureByEqualWindow: readonly number[];
  readonly callerAcousticReferencePressurePa: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCalibratedRmsAcousticPressureByEqualWindow",
    label: "Actual calibrated rms acoustic pressure by equal window",
    kind: "numberList",
  },
  {
    id: "callerAcousticReferencePressurePa",
    label: "Caller acoustic reference pressure pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualCalibratedRmsAcousticPressureByEqualWindow.length)
    simpleError(
      "actualCalibratedRmsAcousticPressureByEqualWindow",
      "Actual nonempty observations.",
    );
  input.actualCalibratedRmsAcousticPressureByEqualWindow.forEach((v) =>
    positive(v, "actualCalibratedRmsAcousticPressureByEqualWindow"),
  );
  positive(
    input.callerAcousticReferencePressurePa,
    "callerAcousticReferencePressurePa",
  );
  return {
    value:
      10 *
      Math.log10(
        mean(
          input.actualCalibratedRmsAcousticPressureByEqualWindow.map(
            (v) => v * v,
          ),
        ) /
          input.callerAcousticReferencePressurePa ** 2,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCalibratedRmsAcousticPressureByEqualWindow: [1, 4.358898943540674],
    callerAcousticReferencePressurePa: 1,
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/acoustic-noise-db",
  title: "Acoustic Noise dB Calculator",
  description:
    "Actual energy-average acoustic sound pressure level dB from equal-exposure positive RMS windows, reference/weighting/distance external; not arithmetic mean of dB, diagnostic noise or safe hearing prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
