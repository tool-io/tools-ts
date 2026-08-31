import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly earlierRetreatRateMYear: number;
  readonly laterRetreatRateMYear: number;
  readonly rateEpochSeparationYears: number;
}>;
export type Output = Readonly<{
  readonly signedRateChangePercent: number;
  readonly signedRetreatAccelerationMYear2: number;
}>;
const inputFields = [
  {
    id: "earlierRetreatRateMYear",
    label: "Earlier retreat rate m year",
    kind: "number",
  },
  {
    id: "laterRetreatRateMYear",
    label: "Later retreat rate m year",
    kind: "number",
  },
  {
    id: "rateEpochSeparationYears",
    label: "Rate epoch separation years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.earlierRetreatRateMYear, "earlierRetreatRateMYear");
  positive(input.rateEpochSeparationYears, "rateEpochSeparationYears");
  return {
    signedRateChangePercent:
      100 *
      ((input.laterRetreatRateMYear - input.earlierRetreatRateMYear) /
        input.earlierRetreatRateMYear),
    signedRetreatAccelerationMYear2:
      (input.laterRetreatRateMYear - input.earlierRetreatRateMYear) /
      input.rateEpochSeparationYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  earlierRetreatRateMYear: 10,
  laterRetreatRateMYear: 15,
  rateEpochSeparationYears: 5,
} satisfies Input;
export const exampleOutput = {
  signedRateChangePercent: 50,
  signedRetreatAccelerationMYear2: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/retreat-acceleration-percent-change",
  title: "Retreat Acceleration Percent Change Calculator",
  description:
    "Compare paired retreat-rate epochs with signed relative change and physical acceleration over actual time separation; reversal to advance retained, zero baseline percent unsupported, not causal acceleration or forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRateChangePercent",
      label: "Signed rate change percent",
      kind: "number",
    },
    {
      id: "signedRetreatAccelerationMYear2",
      label: "Signed retreat acceleration m year2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      earlierRetreatRateMYear: value.earlierRetreatRateMYear as number,
      laterRetreatRateMYear: value.laterRetreatRateMYear as number,
      rateEpochSeparationYears: value.rateEpochSeparationYears as number,
    }),
});
export const run = tool.execute;
export default tool;
