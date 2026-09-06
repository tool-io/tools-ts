import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  linearFit,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAquiferInfluxVolumesM3: readonly number[];
  readonly observedIntervalDays: readonly number[];
  readonly observedMatchedPressureMarginsPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedObservedAquiferPiM3DayPa: number;
  readonly fittedUnexplainedInfluxM3Day: number;
  readonly aquiferPiFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedAquiferInfluxVolumesM3",
    label: "Observed aquifer influx volumes m3",
    kind: "numberList",
  },
  {
    id: "observedIntervalDays",
    label: "Observed interval days",
    kind: "numberList",
  },
  {
    id: "observedMatchedPressureMarginsPa",
    label: "Observed matched pressure margins pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIntervalDays.forEach((v) =>
    positive(v, "observedIntervalDays"),
  );
  input.observedAquiferInfluxVolumesM3.forEach((v) =>
    nonnegative(v, "observedAquiferInfluxVolumesM3"),
  );
  input.observedMatchedPressureMarginsPa.forEach((v) =>
    nonnegative(v, "observedMatchedPressureMarginsPa"),
  );
  aligned(
    input.observedAquiferInfluxVolumesM3,
    input.observedIntervalDays,
    "observedAquiferInfluxVolumesM3",
  );
  aligned(
    input.observedAquiferInfluxVolumesM3,
    input.observedMatchedPressureMarginsPa,
    "observedAquiferInfluxVolumesM3",
  );
  const fit = linearFit(
    input.observedMatchedPressureMarginsPa,
    input.observedAquiferInfluxVolumesM3.map(
      (v, i) => v / input.observedIntervalDays[i],
    ),
  );
  return {
    fittedObservedAquiferPiM3DayPa: fit.slope,
    fittedUnexplainedInfluxM3Day: fit.intercept,
    aquiferPiFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAquiferInfluxVolumesM3: [2, 4, 6],
  observedIntervalDays: [1, 1, 1],
  observedMatchedPressureMarginsPa: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  fittedObservedAquiferPiM3DayPa: 2,
  fittedUnexplainedInfluxM3Day: 0,
  aquiferPiFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/aquifer-productivity-index",
  title: "Petroleum Aquifer Productivity Index Calculator",
  description:
    "Extract actual independently assessed interval aquifer inflow/pressure-margin PI and unexplained intercept, not suppliedPI water-influx forecast. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedObservedAquiferPiM3DayPa",
      label: "Fitted observed aquifer pi m3 day pa",
      kind: "number",
    },
    {
      id: "fittedUnexplainedInfluxM3Day",
      label: "Fitted unexplained influx m3 day",
      kind: "number",
    },
    {
      id: "aquiferPiFitRSquared",
      label: "Aquifer pi fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAquiferInfluxVolumesM3:
        value.observedAquiferInfluxVolumesM3 as readonly number[],
      observedIntervalDays: value.observedIntervalDays as readonly number[],
      observedMatchedPressureMarginsPa:
        value.observedMatchedPressureMarginsPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
