import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  mean,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly dailyMeanTemperaturesC: readonly number[];
  readonly dailyMinimumTemperaturesC: readonly number[];
  readonly callerBudbreakHeatBaseC: number;
  readonly callerBudbreakHeatSumCelsiusDays: number;
  readonly callerPostBudbreakFrostThresholdC: number;
}>;
export type Output = Readonly<{
  readonly callerModelBudbreakFound: boolean;
  readonly callerModelBudbreakDayIndex: number;
  readonly observedPostModelBudbreakFrostIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "dailyMeanTemperaturesC",
    label: "Daily mean temperatures c",
    kind: "numberList",
  },
  {
    id: "dailyMinimumTemperaturesC",
    label: "Daily minimum temperatures c",
    kind: "numberList",
  },
  {
    id: "callerBudbreakHeatBaseC",
    label: "Caller budbreak heat base c",
    kind: "number",
  },
  {
    id: "callerBudbreakHeatSumCelsiusDays",
    label: "Caller budbreak heat sum celsius days",
    kind: "number",
  },
  {
    id: "callerPostBudbreakFrostThresholdC",
    label: "Caller post budbreak frost threshold c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerBudbreakHeatSumCelsiusDays,
    "callerBudbreakHeatSumCelsiusDays",
  );
  aligned(
    input.dailyMeanTemperaturesC,
    input.dailyMinimumTemperaturesC,
    "dailyMeanTemperaturesC",
  );
  if (
    input.dailyMinimumTemperaturesC.some(
      (v, i) => v > input.dailyMeanTemperaturesC[i],
    )
  )
    simpleError("minimum", "Daily minimum cannot exceed mean temperature.");
  let heat = 0,
    day = -1;
  input.dailyMeanTemperaturesC.forEach((v, i) => {
    heat += Math.max(0, v - input.callerBudbreakHeatBaseC);
    if (day === -1 && heat >= input.callerBudbreakHeatSumCelsiusDays) day = i;
  });
  return {
    callerModelBudbreakFound: day !== -1,
    callerModelBudbreakDayIndex: day,
    observedPostModelBudbreakFrostIndices:
      day === -1
        ? []
        : input.dailyMinimumTemperaturesC.flatMap((v, i) =>
            i >= day && v < input.callerPostBudbreakFrostThresholdC ? [i] : [],
          ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMeanTemperaturesC: [0, 10, 10, 10],
  dailyMinimumTemperaturesC: [0, 0, -1, 1],
  callerBudbreakHeatBaseC: 5,
  callerBudbreakHeatSumCelsiusDays: 10,
  callerPostBudbreakFrostThresholdC: 0,
} satisfies Input;
export const exampleOutput = {
  callerModelBudbreakFound: true,
  callerModelBudbreakDayIndex: 2,
  observedPostModelBudbreakFrostIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/frost-risk-budbreak-date-estimate",
  title: "Frost Risk Budbreak Date Estimate",
  description:
    "Locate caller heat-sum budbreak proxy then audit observed subsequent frost, not a repeat GDD accumulator or validated phenology/damage forecast; start/reset and heat calibration must be independently established.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModelBudbreakFound",
      label: "Caller model budbreak found",
      kind: "boolean",
    },
    {
      id: "callerModelBudbreakDayIndex",
      label: "Caller model budbreak day index",
      kind: "number",
    },
    {
      id: "observedPostModelBudbreakFrostIndices",
      label: "Observed post model budbreak frost indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyMeanTemperaturesC: value.dailyMeanTemperaturesC as readonly number[],
      dailyMinimumTemperaturesC:
        value.dailyMinimumTemperaturesC as readonly number[],
      callerBudbreakHeatBaseC: value.callerBudbreakHeatBaseC as number,
      callerBudbreakHeatSumCelsiusDays:
        value.callerBudbreakHeatSumCelsiusDays as number,
      callerPostBudbreakFrostThresholdC:
        value.callerPostBudbreakFrostThresholdC as number,
    }),
});
export const run = tool.execute;
export default tool;
