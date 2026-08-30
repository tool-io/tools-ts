import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly originationCountsByInterval: readonly number[];
  readonly lineageCountsAtRisk: readonly number[];
  readonly intervalDurationsMyr: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalLineageMillionYearExposure: number;
  readonly originationRatePerLineageMyr: number;
  readonly poissonRateStandardError: number;
}>;
const inputFields = [
  {
    id: "originationCountsByInterval",
    label: "Origination counts by interval",
    kind: "numberList",
  },
  {
    id: "lineageCountsAtRisk",
    label: "Lineage counts at risk",
    kind: "numberList",
  },
  {
    id: "intervalDurationsMyr",
    label: "Interval durations myr",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalDurationsMyr.forEach((v) =>
    positive(v, "intervalDurationsMyr"),
  );
  input.originationCountsByInterval.forEach((v) =>
    count(v, "originationCountsByInterval"),
  );
  input.lineageCountsAtRisk.forEach((v) => count(v, "lineageCountsAtRisk"));
  aligned(
    input.originationCountsByInterval,
    input.lineageCountsAtRisk,
    "originationCountsByInterval",
  );
  aligned(
    input.originationCountsByInterval,
    input.intervalDurationsMyr,
    "originationCountsByInterval",
  );
  const totalLineageMillionYearExposure = positive(
      input.lineageCountsAtRisk.reduce(
        (s, v, i) => s + v * input.intervalDurationsMyr[i],
        0,
      ),
      "exposure",
    ),
    events = input.originationCountsByInterval.reduce((a, b) => a + b, 0);
  return {
    totalLineageMillionYearExposure,
    originationRatePerLineageMyr: events / totalLineageMillionYearExposure,
    poissonRateStandardError:
      Math.sqrt(events) / totalLineageMillionYearExposure,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originationCountsByInterval: [2, 4],
  lineageCountsAtRisk: [10, 20],
  intervalDurationsMyr: [1, 2],
} satisfies Input;
export const exampleOutput = {
  totalLineageMillionYearExposure: 50,
  originationRatePerLineageMyr: 0.12,
  poissonRateStandardError: 0.04898979485566356,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/origination-rate-per-lmyr",
  title: "Origination Rate per Lineage-Million-Year",
  description:
    "Normalize observed origination events by explicit lineage-time exposure with an independent Poisson count standard error; no preservation correction or phylogenetic birth-rate inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalLineageMillionYearExposure",
      label: "Total lineage million year exposure",
      kind: "number",
    },
    {
      id: "originationRatePerLineageMyr",
      label: "Origination rate per lineage myr",
      kind: "number",
    },
    {
      id: "poissonRateStandardError",
      label: "Poisson rate standard error",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      originationCountsByInterval:
        value.originationCountsByInterval as readonly number[],
      lineageCountsAtRisk: value.lineageCountsAtRisk as readonly number[],
      intervalDurationsMyr: value.intervalDurationsMyr as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
