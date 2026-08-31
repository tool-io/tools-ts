import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredWorkEnergyWatts: number;
  readonly measuredRestEnergyWatts: number;
  readonly callerAllowedAverageEnergyWatts: number;
}>;
export type Output = Readonly<{
  readonly minimumModelRestPerWorkTimeRatio: number;
  readonly minimumModelRestSharePercent: number;
}>;
const inputFields = [
  {
    id: "measuredWorkEnergyWatts",
    label: "Measured work energy watts",
    kind: "number",
  },
  {
    id: "measuredRestEnergyWatts",
    label: "Measured rest energy watts",
    kind: "number",
  },
  {
    id: "callerAllowedAverageEnergyWatts",
    label: "Caller allowed average energy watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerAllowedAverageEnergyWatts,
    "callerAllowedAverageEnergyWatts",
  );
  nonnegative(input.measuredWorkEnergyWatts, "measuredWorkEnergyWatts");
  nonnegative(input.measuredRestEnergyWatts, "measuredRestEnergyWatts");
  if (input.measuredRestEnergyWatts >= input.callerAllowedAverageEnergyWatts)
    simpleError(
      "rest",
      "Rest demand must be below allowed average for finite rest allowance model.",
    );
  const r =
    Math.max(
      0,
      input.measuredWorkEnergyWatts - input.callerAllowedAverageEnergyWatts,
    ) /
    (input.callerAllowedAverageEnergyWatts - input.measuredRestEnergyWatts);
  return {
    minimumModelRestPerWorkTimeRatio: r,
    minimumModelRestSharePercent: (100 * r) / (1 + r),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredWorkEnergyWatts: 300,
  measuredRestEnergyWatts: 100,
  callerAllowedAverageEnergyWatts: 200,
} satisfies Input;
export const exampleOutput = {
  minimumModelRestPerWorkTimeRatio: 1,
  minimumModelRestSharePercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/rest-allowance-static-posture",
  title: "Metabolic Rest Allowance Percent Calculator for Static Posture",
  description:
    "Invert caller measured metabolic work/rest rates into average-energy-compatible rest ratio/share; static-posture vascular/mechanical stress is not modeled, so this is not a safe rest prescription.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumModelRestPerWorkTimeRatio",
      label: "Minimum model rest per work time ratio",
      kind: "number",
    },
    {
      id: "minimumModelRestSharePercent",
      label: "Minimum model rest share percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredWorkEnergyWatts: value.measuredWorkEnergyWatts as number,
      measuredRestEnergyWatts: value.measuredRestEnergyWatts as number,
      callerAllowedAverageEnergyWatts:
        value.callerAllowedAverageEnergyWatts as number,
    }),
});
export const run = tool.execute;
export default tool;
