import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly leftVolumeMm3: number;
  readonly rightVolumeMm3: number;
  readonly intracranialVolumeMm3: number;
  readonly referenceIntracranialVolumeMm3: number;
  readonly regressionSlope: number;
}>;
export type Output = Readonly<{
  readonly bilateralVolumeMm3: number;
  readonly icvFraction: number;
  readonly regressionAdjustedVolumeMm3: number;
}>;
const inputFields = [
  { id: "leftVolumeMm3", label: "Left volume mm3", kind: "number" },
  { id: "rightVolumeMm3", label: "Right volume mm3", kind: "number" },
  {
    id: "intracranialVolumeMm3",
    label: "Intracranial volume mm3",
    kind: "number",
  },
  {
    id: "referenceIntracranialVolumeMm3",
    label: "Reference intracranial volume mm3",
    kind: "number",
  },
  { id: "regressionSlope", label: "Regression slope", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.leftVolumeMm3, "leftVolumeMm3");
  nonnegative(input.rightVolumeMm3, "rightVolumeMm3");
  positive(input.intracranialVolumeMm3, "intracranialVolumeMm3");
  positive(
    input.referenceIntracranialVolumeMm3,
    "referenceIntracranialVolumeMm3",
  );
  const bilateralVolumeMm3 = input.leftVolumeMm3 + input.rightVolumeMm3;
  if (bilateralVolumeMm3 > input.intracranialVolumeMm3)
    simpleError(
      "intracranialVolumeMm3",
      "Regional volume cannot exceed intracranial volume.",
    );
  return {
    bilateralVolumeMm3,
    icvFraction: bilateralVolumeMm3 / input.intracranialVolumeMm3,
    regressionAdjustedVolumeMm3:
      bilateralVolumeMm3 -
      input.regressionSlope *
        (input.intracranialVolumeMm3 - input.referenceIntracranialVolumeMm3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftVolumeMm3: 3000,
  rightVolumeMm3: 3200,
  intracranialVolumeMm3: 1400000,
  referenceIntracranialVolumeMm3: 1500000,
  regressionSlope: 0.004,
} satisfies Input;
export const exampleOutput = {
  bilateralVolumeMm3: 6200,
  icvFraction: 0.004428571428571428,
  regressionAdjustedVolumeMm3: 6600,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/hippocampal-volume-adjustment",
  title: "Normalized Hippocampal Volume",
  description:
    "Report bilateral hippocampal volume, ICV fraction and regression-based ICV adjustment using a supplied normative slope and reference; segmentation validity is external.",
  inputs: inputFields,
  outputs: [
    { id: "bilateralVolumeMm3", label: "Bilateral volume mm3", kind: "number" },
    { id: "icvFraction", label: "Icv fraction", kind: "number" },
    {
      id: "regressionAdjustedVolumeMm3",
      label: "Regression adjusted volume mm3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      leftVolumeMm3: value.leftVolumeMm3 as number,
      rightVolumeMm3: value.rightVolumeMm3 as number,
      intracranialVolumeMm3: value.intracranialVolumeMm3 as number,
      referenceIntracranialVolumeMm3:
        value.referenceIntracranialVolumeMm3 as number,
      regressionSlope: value.regressionSlope as number,
    }),
});
export const run = tool.execute;
export default tool;
