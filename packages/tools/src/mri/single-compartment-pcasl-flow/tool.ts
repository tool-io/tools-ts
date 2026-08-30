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
  readonly deltaM: number;
  readonly referenceM0: number;
  readonly partitionMlPerGram: number;
  readonly labelEfficiency: number;
  readonly bloodT1Seconds: number;
  readonly labelDurationSeconds: number;
  readonly postLabelDelaySeconds: number;
}>;
export type Output = Readonly<{
  readonly cbfMlPer100GramMinute: number;
}>;
const inputFields = [
  { id: "deltaM", label: "Delta m", kind: "number" },
  { id: "referenceM0", label: "Reference m0", kind: "number" },
  { id: "partitionMlPerGram", label: "Partition ml per gram", kind: "number" },
  { id: "labelEfficiency", label: "Label efficiency", kind: "number" },
  {
    id: "bloodT1Seconds",
    label: "Blood t1 seconds",
    kind: "number",
    unit: "s",
  },
  {
    id: "labelDurationSeconds",
    label: "Label duration seconds",
    kind: "number",
    unit: "s",
  },
  {
    id: "postLabelDelaySeconds",
    label: "Post label delay seconds",
    kind: "number",
    unit: "s",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceM0, "referenceM0");
  positive(input.partitionMlPerGram, "partitionMlPerGram");
  positive(input.labelEfficiency, "labelEfficiency");
  fraction(input.labelEfficiency, "labelEfficiency");
  positive(input.bloodT1Seconds, "bloodT1Seconds");
  positive(input.labelDurationSeconds, "labelDurationSeconds");
  nonnegative(input.postLabelDelaySeconds, "postLabelDelaySeconds");
  return {
    cbfMlPer100GramMinute:
      (6000 *
        input.partitionMlPerGram *
        input.deltaM *
        Math.exp(input.postLabelDelaySeconds / input.bloodT1Seconds)) /
      (2 *
        input.labelEfficiency *
        input.bloodT1Seconds *
        input.referenceM0 *
        (1 - Math.exp(-input.labelDurationSeconds / input.bloodT1Seconds))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deltaM: 1,
  referenceM0: 100,
  partitionMlPerGram: 0.9,
  labelEfficiency: 0.8,
  bloodT1Seconds: 1.5,
  labelDurationSeconds: 1.8,
  postLabelDelaySeconds: 1,
} satisfies Input;
export const exampleOutput = {
  cbfMlPer100GramMinute: 62.71272601168575,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/single-compartment-pcasl-flow",
  title: "CBF Quantification ASL",
  description:
    "Evaluate the ideal single-compartment pCASL CBF equation with supplied calibration and timing; negative measured ΔM is preserved, and transit delay, exchange and partial-volume effects are not corrected.",
  inputs: inputFields,
  outputs: [
    {
      id: "cbfMlPer100GramMinute",
      label: "Cbf ml per100 gram minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deltaM: value.deltaM as number,
      referenceM0: value.referenceM0 as number,
      partitionMlPerGram: value.partitionMlPerGram as number,
      labelEfficiency: value.labelEfficiency as number,
      bloodT1Seconds: value.bloodT1Seconds as number,
      labelDurationSeconds: value.labelDurationSeconds as number,
      postLabelDelaySeconds: value.postLabelDelaySeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
