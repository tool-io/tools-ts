import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly lakeTemperaturesC: readonly number[];
  readonly referenceTemperaturesC: readonly number[];
  readonly baselineLakeReferenceDifferenceC: number;
  readonly callerMaximumExcessC: number;
}>;
export type Output = Readonly<{
  readonly baselineCorrectedLakeAnomaliesC: readonly number[];
  readonly aboveCallerExcessFlags: readonly number[];
}>;
const inputFields = [
  { id: "lakeTemperaturesC", label: "Lake temperatures c", kind: "numberList" },
  {
    id: "referenceTemperaturesC",
    label: "Reference temperatures c",
    kind: "numberList",
  },
  {
    id: "baselineLakeReferenceDifferenceC",
    label: "Baseline lake reference difference c",
    kind: "number",
  },
  {
    id: "callerMaximumExcessC",
    label: "Caller maximum excess c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerMaximumExcessC, "callerMaximumExcessC");
  aligned(
    input.lakeTemperaturesC,
    input.referenceTemperaturesC,
    "lakeTemperaturesC",
  );
  const baselineCorrectedLakeAnomaliesC = input.lakeTemperaturesC.map(
    (v, i) =>
      v -
      input.referenceTemperaturesC[i] -
      input.baselineLakeReferenceDifferenceC,
  );
  return {
    baselineCorrectedLakeAnomaliesC,
    aboveCallerExcessFlags: baselineCorrectedLakeAnomaliesC.map((v) =>
      v > input.callerMaximumExcessC ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lakeTemperaturesC: [30, 32, 35],
  referenceTemperaturesC: [20, 22, 23],
  baselineLakeReferenceDifferenceC: 10,
  callerMaximumExcessC: 1,
} satisfies Input;
export const exampleOutput = {
  baselineCorrectedLakeAnomaliesC: [0, 0, 2],
  aboveCallerExcessFlags: [0, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/crater-lake-temperature-anomaly-checker",
  title: "Crater Lake Temperature Anomaly Checker",
  description:
    "Monitor matched lake/reference temperature differences after a caller seasonal baseline contrast; flags are data anomalies, not evidence of volcanic heating or eruption risk.",
  inputs: inputFields,
  outputs: [
    {
      id: "baselineCorrectedLakeAnomaliesC",
      label: "Baseline corrected lake anomalies c",
      kind: "numberList",
    },
    {
      id: "aboveCallerExcessFlags",
      label: "Above caller excess flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      lakeTemperaturesC: value.lakeTemperaturesC as readonly number[],
      referenceTemperaturesC: value.referenceTemperaturesC as readonly number[],
      baselineLakeReferenceDifferenceC:
        value.baselineLakeReferenceDifferenceC as number,
      callerMaximumExcessC: value.callerMaximumExcessC as number,
    }),
});
export const run = tool.execute;
export default tool;
