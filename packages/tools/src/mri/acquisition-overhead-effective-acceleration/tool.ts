import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly fullAcquisitionSeconds: number;
  readonly acceleratedReadoutSeconds: number;
  readonly calibrationSeconds: number;
  readonly fixedOverheadSeconds: number;
}>;
export type Output = Readonly<{
  readonly acceleratedTotalSeconds: number;
  readonly effectiveAcceleration: number;
  readonly savedSeconds: number;
}>;
const inputFields = [
  {
    id: "fullAcquisitionSeconds",
    label: "Full acquisition seconds",
    kind: "number",
    unit: "s",
  },
  {
    id: "acceleratedReadoutSeconds",
    label: "Accelerated readout seconds",
    kind: "number",
    unit: "s",
  },
  {
    id: "calibrationSeconds",
    label: "Calibration seconds",
    kind: "number",
    unit: "s",
  },
  {
    id: "fixedOverheadSeconds",
    label: "Fixed overhead seconds",
    kind: "number",
    unit: "s",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fullAcquisitionSeconds, "fullAcquisitionSeconds");
  positive(input.acceleratedReadoutSeconds, "acceleratedReadoutSeconds");
  nonnegative(input.calibrationSeconds, "calibrationSeconds");
  nonnegative(input.fixedOverheadSeconds, "fixedOverheadSeconds");
  const acceleratedTotalSeconds =
    input.acceleratedReadoutSeconds +
    input.calibrationSeconds +
    input.fixedOverheadSeconds;
  return {
    acceleratedTotalSeconds,
    effectiveAcceleration:
      input.fullAcquisitionSeconds / acceleratedTotalSeconds,
    savedSeconds: input.fullAcquisitionSeconds - acceleratedTotalSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fullAcquisitionSeconds: 100,
  acceleratedReadoutSeconds: 20,
  calibrationSeconds: 5,
  fixedOverheadSeconds: 5,
} satisfies Input;
export const exampleOutput = {
  acceleratedTotalSeconds: 30,
  effectiveAcceleration: 3.3333333333333335,
  savedSeconds: 70,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/acquisition-overhead-effective-acceleration",
  title: "Acceleration Factor Rate",
  description:
    "Compare a supplied full acquisition with accelerated readout plus explicit calibration and fixed overhead; effective acceleration can be below one.",
  inputs: inputFields,
  outputs: [
    {
      id: "acceleratedTotalSeconds",
      label: "Accelerated total seconds",
      kind: "number",
      unit: "s",
    },
    {
      id: "effectiveAcceleration",
      label: "Effective acceleration",
      kind: "number",
    },
    { id: "savedSeconds", label: "Saved seconds", kind: "number", unit: "s" },
  ],
  calculate: (value) =>
    calculate({
      fullAcquisitionSeconds: value.fullAcquisitionSeconds as number,
      acceleratedReadoutSeconds: value.acceleratedReadoutSeconds as number,
      calibrationSeconds: value.calibrationSeconds as number,
      fixedOverheadSeconds: value.fixedOverheadSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
