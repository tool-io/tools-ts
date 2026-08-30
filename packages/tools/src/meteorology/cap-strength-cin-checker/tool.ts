import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
  maximum,
} from "../shared.js";

export type Input = Readonly<{
  readonly heightsM: readonly number[];
  readonly environmentTemperaturesC: readonly number[];
  readonly parcelTemperaturesC: readonly number[];
  readonly callerCapDifferenceThresholdC: number;
}>;
export type Output = Readonly<{
  readonly maximumObservedCapTemperatureDifferenceC: number;
  readonly firstMaximumCapHeightM: number;
  readonly aboveCallerCapDifferenceThreshold: boolean;
}>;
const inputFields = [
  { id: "heightsM", label: "Heights m", kind: "numberList" },
  {
    id: "environmentTemperaturesC",
    label: "Environment temperatures c",
    kind: "numberList",
  },
  {
    id: "parcelTemperaturesC",
    label: "Parcel temperatures c",
    kind: "numberList",
  },
  {
    id: "callerCapDifferenceThresholdC",
    label: "Caller cap difference threshold c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerCapDifferenceThresholdC,
    "callerCapDifferenceThresholdC",
  );
  aligned(input.heightsM, input.environmentTemperaturesC, "heightsM");
  aligned(input.heightsM, input.parcelTemperaturesC, "heightsM");
  ordered(input.heightsM, "heights");
  const d = input.environmentTemperaturesC.map(
      (t, i) => t - input.parcelTemperaturesC[i],
    ),
    m = maximum(d);
  return {
    maximumObservedCapTemperatureDifferenceC: m,
    firstMaximumCapHeightM: input.heightsM[d.indexOf(m)],
    aboveCallerCapDifferenceThreshold: m > input.callerCapDifferenceThresholdC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  heightsM: [0, 1000, 2000],
  environmentTemperaturesC: [10, 15, 0],
  parcelTemperaturesC: [10, 5, 5],
  callerCapDifferenceThresholdC: 8,
} satisfies Input;
export const exampleOutput = {
  maximumObservedCapTemperatureDifferenceC: 10,
  firstMaximumCapHeightM: 1000,
  aboveCallerCapDifferenceThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/cap-strength-cin-checker",
  title: "Cap Strength CIN Checker",
  description:
    "Audit maximum measured environmental-minus-parcel cap temperature excess and location against caller threshold; not integrated CIN or proof that convection cannot occur.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumObservedCapTemperatureDifferenceC",
      label: "Maximum observed cap temperature difference c",
      kind: "number",
    },
    {
      id: "firstMaximumCapHeightM",
      label: "First maximum cap height m",
      kind: "number",
    },
    {
      id: "aboveCallerCapDifferenceThreshold",
      label: "Above caller cap difference threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      heightsM: value.heightsM as readonly number[],
      environmentTemperaturesC:
        value.environmentTemperaturesC as readonly number[],
      parcelTemperaturesC: value.parcelTemperaturesC as readonly number[],
      callerCapDifferenceThresholdC:
        value.callerCapDifferenceThresholdC as number,
    }),
});
export const run = tool.execute;
export default tool;
