import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly measuredTransferMagnitudes: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly offTargetFractions: readonly number[];
  readonly maximumOffTargetFraction: number;
}>;
const inputFields = [
  {
    id: "measuredTransferMagnitudes",
    label: "Measured transfer magnitudes",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = input.measuredTransferMagnitudes,
    n = m.length;
  if (!n || m.some((row) => row.length !== n || row.some((v) => v < 0)))
    simpleError(
      "measuredTransferMagnitudes",
      "Nonnegative square source-row/target-column transfer magnitudes required.",
    );
  const offTargetFractions = m.map((row, i) => {
    const sum = positive(
      row.reduce((a, b) => a + b, 0),
      "measuredTransferMagnitudes",
    );
    return (sum - row[i]) / sum;
  });
  return {
    offTargetFractions,
    maximumOffTargetFraction: Math.max(...offTargetFractions),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredTransferMagnitudes: [
    [10, 1],
    [2, 10],
  ],
} satisfies Input;
export const exampleOutput = {
  offTargetFractions: [0.09090909090909091, 0.16666666666666666],
  maximumOffTargetFraction: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/multislice-leakage-matrix-audit",
  title: "Simultaneous Multi-Slice Leakage",
  description:
    "Audit leakage fractions from measured source-to-target slice transfer magnitudes; source rows require consistent calibration and this is not a slice-unmixing algorithm.",
  inputs: inputFields,
  outputs: [
    {
      id: "offTargetFractions",
      label: "Off target fractions",
      kind: "numberList",
    },
    {
      id: "maximumOffTargetFraction",
      label: "Maximum off target fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredTransferMagnitudes:
        value.measuredTransferMagnitudes as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
