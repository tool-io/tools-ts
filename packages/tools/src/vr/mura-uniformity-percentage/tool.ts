import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMatchedFieldLuminanceMeasurements: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMatchedFieldLuminanceMeasurements",
    label: "Actual matched field luminance measurements",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualMatchedFieldLuminanceMeasurements.length)
    simpleError(
      "actualMatchedFieldLuminanceMeasurements",
      "Actual nonempty observations.",
    );
  input.actualMatchedFieldLuminanceMeasurements.forEach((v) =>
    nonnegative(v, "actualMatchedFieldLuminanceMeasurements"),
  );
  positive(
    Math.max(...input.actualMatchedFieldLuminanceMeasurements),
    "maximum",
  );
  return {
    value:
      (100 * Math.min(...input.actualMatchedFieldLuminanceMeasurements)) /
      Math.max(...input.actualMatchedFieldLuminanceMeasurements),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMatchedFieldLuminanceMeasurements: [2, 4] },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/mura-uniformity-percentage",
  title: "Mura Uniformity Percentage Calculator",
  description:
    "Observed luminance uniformity100min/max under actual flat field/homogeneous mask, test nonzero maximum; not RMS mura or model spatial defect visibility.",
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
