import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredRadiographicFileLengthMm: number;
  readonly independentlyMeasuredRadiographicToothLengthMm: number;
  readonly verifiedActualInsertedFileLengthMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredRadiographicFileLengthMm",
    label: "Independently measured radiographic file length mm",
    kind: "number",
  },
  {
    id: "independentlyMeasuredRadiographicToothLengthMm",
    label: "Independently measured radiographic tooth length mm",
    kind: "number",
  },
  {
    id: "verifiedActualInsertedFileLengthMm",
    label: "Verified actual inserted file length mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.independentlyMeasuredRadiographicFileLengthMm,
    input.independentlyMeasuredRadiographicToothLengthMm,
    input.verifiedActualInsertedFileLengthMm,
  ].forEach((v) => positive(v, "actual-length"));
  return {
    conditionalCalibratedRadiographicToothLengthMm:
      (input.independentlyMeasuredRadiographicToothLengthMm *
        input.verifiedActualInsertedFileLengthMm) /
      input.independentlyMeasuredRadiographicFileLengthMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredRadiographicFileLengthMm: 21,
    independentlyMeasuredRadiographicToothLengthMm: 24,
    verifiedActualInsertedFileLengthMm: 20,
  },
  output: {
    result: {
      conditionalCalibratedRadiographicToothLengthMm: 22.857142857142858,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/working-length-radiograph-adjustment",
  title: "Working Length Radiograph Adjustment Calculator",
  description:
    "Conditional shared-scale radiographic magnification correction using an actual known-length inserted file. Projection/curvature distortion and anatomical endpoint independently assessed; not a prescribed working length or guarantee apex position.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
