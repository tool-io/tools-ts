import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly waterFlowM3PerHour: number;
  readonly appliedOzoneGramsPerHour: number;
  readonly gasTransferFraction: number;
  readonly waterDemandMgPerLiter: number;
}>;
export type Output = Readonly<{
  readonly transferredDoseMgPerLiter: number;
  readonly idealPostDemandResidualMgPerLiter: number;
  readonly untransferredOzoneGramsPerHour: number;
}>;
const inputFields = [
  { id: "waterFlowM3PerHour", label: "Water flow m3 per hour", kind: "number" },
  {
    id: "appliedOzoneGramsPerHour",
    label: "Applied ozone grams per hour",
    kind: "number",
  },
  { id: "gasTransferFraction", label: "Gas transfer fraction", kind: "number" },
  {
    id: "waterDemandMgPerLiter",
    label: "Water demand mg per liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterFlowM3PerHour, "waterFlowM3PerHour");
  nonnegative(input.appliedOzoneGramsPerHour, "appliedOzoneGramsPerHour");
  nonnegative(input.waterDemandMgPerLiter, "waterDemandMgPerLiter");
  fraction(input.gasTransferFraction, "gasTransferFraction");
  const transferredDoseMgPerLiter =
    (input.appliedOzoneGramsPerHour * input.gasTransferFraction) /
    input.waterFlowM3PerHour;
  return {
    transferredDoseMgPerLiter,
    idealPostDemandResidualMgPerLiter: Math.max(
      0,
      transferredDoseMgPerLiter - input.waterDemandMgPerLiter,
    ),
    untransferredOzoneGramsPerHour:
      input.appliedOzoneGramsPerHour * (1 - input.gasTransferFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waterFlowM3PerHour: 100,
  appliedOzoneGramsPerHour: 500,
  gasTransferFraction: 0.8,
  waterDemandMgPerLiter: 3,
} satisfies Input;
export const exampleOutput = {
  transferredDoseMgPerLiter: 4,
  idealPostDemandResidualMgPerLiter: 1,
  untransferredOzoneGramsPerHour: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/ozone-dose",
  title: "Ozone Dose",
  description:
    "Balance applied ozone, gas transfer and supplied instantaneous water demand; ideal residual excludes decay/contact kinetics and is not a fish-safe operating dose.",
  inputs: inputFields,
  outputs: [
    {
      id: "transferredDoseMgPerLiter",
      label: "Transferred dose mg per liter",
      kind: "number",
    },
    {
      id: "idealPostDemandResidualMgPerLiter",
      label: "Ideal post demand residual mg per liter",
      kind: "number",
    },
    {
      id: "untransferredOzoneGramsPerHour",
      label: "Untransferred ozone grams per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      waterFlowM3PerHour: value.waterFlowM3PerHour as number,
      appliedOzoneGramsPerHour: value.appliedOzoneGramsPerHour as number,
      gasTransferFraction: value.gasTransferFraction as number,
      waterDemandMgPerLiter: value.waterDemandMgPerLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
