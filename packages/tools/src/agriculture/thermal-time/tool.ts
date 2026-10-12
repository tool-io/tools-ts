import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess: readonly number[];
  readonly actualMatchingIntervalDays: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess",
    label:
      "Actual independently qualified interval effective temperature excess",
    kind: "numberList",
  },
  {
    id: "actualMatchingIntervalDays",
    label: "Actual matching interval days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (
    !input.actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess.length
  )
    simpleError(
      "actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess.forEach(
    (v) =>
      nonnegative(
        v,
        "actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess",
      ),
  );
  if (!input.actualMatchingIntervalDays.length)
    simpleError("actualMatchingIntervalDays", "Actual nonempty observations.");
  input.actualMatchingIntervalDays.forEach((v) =>
    positive(v, "actualMatchingIntervalDays"),
  );
  aligned(
    input.actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess,
    input.actualMatchingIntervalDays,
    "intervals",
  );
  return {
    value: sum(
      input.actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess.map(
        (v, i) => v * input.actualMatchingIntervalDays[i],
      ),
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyQualifiedIntervalEffectiveTemperatureExcess: [2, 4],
    actualMatchingIntervalDays: [2, 2],
  },
  output: { result: { value: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/thermal-time",
  title: "Agriculture Thermal Time Calculator",
  description:
    "Actual fractional interval thermal-time integral of independently already capped/thresholded effective excess\u00d7interval days, not daily GDD min max calculator or select crop base/cap.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
