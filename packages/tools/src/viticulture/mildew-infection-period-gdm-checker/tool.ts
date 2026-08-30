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
  ordered,
  binary,
  runs,
} from "../shared.js";
export type Input = Readonly<{
  readonly observationHours: readonly number[];
  readonly observedTemperaturesC: readonly number[];
  readonly leafWetFlags: readonly number[];
  readonly callerInfectionTemperatureBandC: readonly number[];
  readonly callerMinimumContinuousWetHours: number;
}>;
export type Output = Readonly<{
  readonly qualifyingWetEpisodeStartHours: readonly number[];
  readonly qualifyingWetEpisodeDurationsHours: readonly number[];
  readonly callerExposureCriterionMet: boolean;
}>;
const inputFields = [
  { id: "observationHours", label: "Observation hours", kind: "numberList" },
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
  { id: "leafWetFlags", label: "Leaf wet flags", kind: "numberList" },
  {
    id: "callerInfectionTemperatureBandC",
    label: "Caller infection temperature band c",
    kind: "numberList",
  },
  {
    id: "callerMinimumContinuousWetHours",
    label: "Caller minimum continuous wet hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMinimumContinuousWetHours,
    "callerMinimumContinuousWetHours",
  );
  ordered(input.observationHours, "hours");
  aligned(input.observationHours, input.observedTemperaturesC, "observations");
  if (
    input.leafWetFlags.length !== input.observationHours.length - 1 ||
    input.callerInfectionTemperatureBandC.length !== 2 ||
    input.callerInfectionTemperatureBandC[0] >
      input.callerInfectionTemperatureBandC[1]
  )
    simpleError(
      "coverage",
      "One interval wetness flag per consecutive time pair and ordered temperature band required.",
    );
  binary(input.leafWetFlags, "wetness");
  const flags = input.leafWetFlags.map(
      (v, i) =>
        v === 1 &&
        input.observedTemperaturesC[i] >=
          input.callerInfectionTemperatureBandC[0] &&
        input.observedTemperaturesC[i] <=
          input.callerInfectionTemperatureBandC[1] &&
        input.observedTemperaturesC[i + 1] >=
          input.callerInfectionTemperatureBandC[0] &&
        input.observedTemperaturesC[i + 1] <=
          input.callerInfectionTemperatureBandC[1],
    ),
    r = runs(flags),
    starts: number[] = [],
    durations: number[] = [];
  r.starts.forEach((i, j) => {
    const d =
      input.observationHours[i + r.lengths[j]] - input.observationHours[i];
    if (d >= input.callerMinimumContinuousWetHours) {
      starts.push(input.observationHours[i]);
      durations.push(d);
    }
  });
  return {
    qualifyingWetEpisodeStartHours: starts,
    qualifyingWetEpisodeDurationsHours: durations,
    callerExposureCriterionMet: starts.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationHours: [0, 1, 2, 3],
  observedTemperaturesC: [20, 20, 20, 20],
  leafWetFlags: [1, 1, 0],
  callerInfectionTemperatureBandC: [15, 25],
  callerMinimumContinuousWetHours: 2,
} satisfies Input;
export const exampleOutput = {
  qualifyingWetEpisodeStartHours: [0],
  qualifyingWetEpisodeDurationsHours: [2],
  callerExposureCriterionMet: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/mildew-infection-period-gdm-checker",
  title: "Mildew Infection Period GDM Checker",
  description:
    "Audit continuous leaf-wet intervals wholly within caller downy-mildew temperature policy and wet duration; observed exposure criterion is not pathogen presence, validated GDM disease model, infection proof or spray recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifyingWetEpisodeStartHours",
      label: "Qualifying wet episode start hours",
      kind: "numberList",
    },
    {
      id: "qualifyingWetEpisodeDurationsHours",
      label: "Qualifying wet episode durations hours",
      kind: "numberList",
    },
    {
      id: "callerExposureCriterionMet",
      label: "Caller exposure criterion met",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observationHours: value.observationHours as readonly number[],
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
      leafWetFlags: value.leafWetFlags as readonly number[],
      callerInfectionTemperatureBandC:
        value.callerInfectionTemperatureBandC as readonly number[],
      callerMinimumContinuousWetHours:
        value.callerMinimumContinuousWetHours as number,
    }),
});
export const run = tool.execute;
export default tool;
