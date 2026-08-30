import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly surveyTimesDays: readonly number[];
  readonly cumulativeMappedBulkVolumesM3: readonly number[];
  readonly intervalVesicleFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalBulkEffusionM3PerDay: readonly number[];
  readonly meanBulkEffusionKm3PerDay: number;
  readonly meanDreEffusionM3PerDay: number;
}>;
const inputFields = [
  { id: "surveyTimesDays", label: "Survey times days", kind: "numberList" },
  {
    id: "cumulativeMappedBulkVolumesM3",
    label: "Cumulative mapped bulk volumes m3",
    kind: "numberList",
  },
  {
    id: "intervalVesicleFractions",
    label: "Interval vesicle fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cumulativeMappedBulkVolumesM3.forEach((v) =>
    nonnegative(v, "cumulativeMappedBulkVolumesM3"),
  );
  input.intervalVesicleFractions.forEach((v) =>
    fraction(v, "intervalVesicleFractions"),
  );
  ordered(input.surveyTimesDays, "surveyTimesDays");
  aligned(
    input.surveyTimesDays,
    input.cumulativeMappedBulkVolumesM3,
    "surveyTimesDays",
  );
  aligned(
    input.surveyTimesDays.slice(1),
    input.intervalVesicleFractions,
    "intervalVesicleFractions",
  );
  const delta = input.cumulativeMappedBulkVolumesM3
      .slice(1)
      .map((v, i) =>
        nonnegative(
          v - input.cumulativeMappedBulkVolumesM3[i],
          "cumulativeMappedBulkVolumesM3",
        ),
      ),
    span = input.surveyTimesDays.at(-1)! - input.surveyTimesDays[0];
  return {
    intervalBulkEffusionM3PerDay: delta.map(
      (v, i) => v / (input.surveyTimesDays[i + 1] - input.surveyTimesDays[i]),
    ),
    meanBulkEffusionKm3PerDay: delta.reduce((a, b) => a + b, 0) / span / 1e9,
    meanDreEffusionM3PerDay:
      delta.reduce(
        (s, v, i) => s + v * (1 - input.intervalVesicleFractions[i]),
        0,
      ) / span,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  surveyTimesDays: [0, 1, 3],
  cumulativeMappedBulkVolumesM3: [0, 100, 400],
  intervalVesicleFractions: [0.2, 0.5],
} satisfies Input;
export const exampleOutput = {
  intervalBulkEffusionM3PerDay: [100, 150],
  meanBulkEffusionKm3PerDay: 1.3333333333333334e-7,
  meanDreEffusionM3PerDay: 76.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/effusion-rate-average-cubic-km-day",
  title: "Effusion Rate Average Cubic KM Day",
  description:
    "Infer observed interval/whole-span bulk effusion and vesicle-corrected DRE rate from matched surveys; no generic arithmetic average of interval rates or volume loss during emplacement is assumed.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalBulkEffusionM3PerDay",
      label: "Interval bulk effusion m3 per day",
      kind: "numberList",
    },
    {
      id: "meanBulkEffusionKm3PerDay",
      label: "Mean bulk effusion km3 per day",
      kind: "number",
    },
    {
      id: "meanDreEffusionM3PerDay",
      label: "Mean dre effusion m3 per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      surveyTimesDays: value.surveyTimesDays as readonly number[],
      cumulativeMappedBulkVolumesM3:
        value.cumulativeMappedBulkVolumesM3 as readonly number[],
      intervalVesicleFractions:
        value.intervalVesicleFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
