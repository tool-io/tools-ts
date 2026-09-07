import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBgaRowCentersMm: readonly number[];
  readonly observedBgaColumnCentersMm: readonly number[];
  readonly callerNominalBgaPitchMm: number;
}>;
export type Output = Readonly<{
  readonly observedRowPitchMm: readonly number[];
  readonly observedColumnPitchMm: readonly number[];
  readonly maximumAbsolutePitchErrorMm: number;
}>;
const inputFields = [
  {
    id: "observedBgaRowCentersMm",
    label: "Observed bga row centers mm",
    kind: "numberList",
  },
  {
    id: "observedBgaColumnCentersMm",
    label: "Observed bga column centers mm",
    kind: "numberList",
  },
  {
    id: "callerNominalBgaPitchMm",
    label: "Caller nominal bga pitch mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerNominalBgaPitchMm, "callerNominalBgaPitchMm");
  strictlyIncreasing(input.observedBgaRowCentersMm, "rows");
  strictlyIncreasing(input.observedBgaColumnCentersMm, "columns");
  const rows = input.observedBgaRowCentersMm
      .slice(1)
      .map((v, i) => v - input.observedBgaRowCentersMm[i]),
    cols = input.observedBgaColumnCentersMm
      .slice(1)
      .map((v, i) => v - input.observedBgaColumnCentersMm[i]);
  return {
    observedRowPitchMm: rows,
    observedColumnPitchMm: cols,
    maximumAbsolutePitchErrorMm: Math.max(
      ...[...rows, ...cols].map((v) =>
        Math.abs(v - input.callerNominalBgaPitchMm),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBgaRowCentersMm: [0, 1, 2.2],
  observedBgaColumnCentersMm: [0, 1, 2],
  callerNominalBgaPitchMm: 1,
} satisfies Input;
export const exampleOutput = {
  observedRowPitchMm: [1, 1.2],
  observedColumnPitchMm: [1, 1],
  maximumAbsolutePitchErrorMm: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/bga-ball-pitch",
  title: "Semiconductor Bga Ball Pitch Calculator",
  description:
    "Audit actual BGA row/column center spacings and maximum nominal pitch error, not square-array bump density or scalar area-based count.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRowPitchMm",
      label: "Observed row pitch mm",
      kind: "numberList",
    },
    {
      id: "observedColumnPitchMm",
      label: "Observed column pitch mm",
      kind: "numberList",
    },
    {
      id: "maximumAbsolutePitchErrorMm",
      label: "Maximum absolute pitch error mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBgaRowCentersMm:
        value.observedBgaRowCentersMm as readonly number[],
      observedBgaColumnCentersMm:
        value.observedBgaColumnCentersMm as readonly number[],
      callerNominalBgaPitchMm: value.callerNominalBgaPitchMm as number,
    }),
});
export const run = tool.execute;
export default tool;
