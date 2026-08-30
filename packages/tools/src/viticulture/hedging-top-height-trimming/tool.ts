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
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedCanopyTopHeightsM: readonly number[];
  readonly callerHedgeTopHeightsM: readonly number[];
  readonly canopyBottomHeightsM: readonly number[];
  readonly canopyWidthsM: readonly number[];
  readonly representedRowLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly topHeightAboveCallerHedgeM: readonly number[];
  readonly rectangularEnvelopeVolumeAboveCallerHedgeM3: number;
}>;
const inputFields = [
  {
    id: "observedCanopyTopHeightsM",
    label: "Observed canopy top heights m",
    kind: "numberList",
  },
  {
    id: "callerHedgeTopHeightsM",
    label: "Caller hedge top heights m",
    kind: "numberList",
  },
  {
    id: "canopyBottomHeightsM",
    label: "Canopy bottom heights m",
    kind: "numberList",
  },
  { id: "canopyWidthsM", label: "Canopy widths m", kind: "numberList" },
  {
    id: "representedRowLengthsM",
    label: "Represented row lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedRowLengthsM.forEach((v) =>
    positive(v, "representedRowLengthsM"),
  );
  input.canopyWidthsM.forEach((v) => nonnegative(v, "canopyWidthsM"));
  aligned(
    input.observedCanopyTopHeightsM,
    input.callerHedgeTopHeightsM,
    "observedCanopyTopHeightsM",
  );
  aligned(
    input.observedCanopyTopHeightsM,
    input.canopyBottomHeightsM,
    "observedCanopyTopHeightsM",
  );
  aligned(
    input.observedCanopyTopHeightsM,
    input.canopyWidthsM,
    "observedCanopyTopHeightsM",
  );
  aligned(
    input.observedCanopyTopHeightsM,
    input.representedRowLengthsM,
    "observedCanopyTopHeightsM",
  );
  if (
    input.canopyBottomHeightsM.some(
      (v, i) =>
        v > input.observedCanopyTopHeightsM[i] ||
        v > input.callerHedgeTopHeightsM[i],
    )
  )
    simpleError(
      "heights",
      "Observed/caller hedge tops must not be below canopy base.",
    );
  const d = input.observedCanopyTopHeightsM.map((v, i) =>
    Math.max(0, v - input.callerHedgeTopHeightsM[i]),
  );
  return {
    topHeightAboveCallerHedgeM: d,
    rectangularEnvelopeVolumeAboveCallerHedgeM3: d.reduce(
      (s, v, i) =>
        s + v * input.canopyWidthsM[i] * input.representedRowLengthsM[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCanopyTopHeightsM: [2, 3],
  callerHedgeTopHeightsM: [1.5, 2.5],
  canopyBottomHeightsM: [0.5, 1],
  canopyWidthsM: [0.5, 1],
  representedRowLengthsM: [10, 20],
} satisfies Input;
export const exampleOutput = {
  topHeightAboveCallerHedgeM: [0.5, 0.5],
  rectangularEnvelopeVolumeAboveCallerHedgeM3: 12.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/hedging-top-height-trimming",
  title: "Hedging Top Height Trimming",
  description:
    "Account measured canopy envelope above caller hedge-height scenario across unequal row lengths/widths; rectangular envelope is not actual foliage biomass or a growth-control recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "topHeightAboveCallerHedgeM",
      label: "Top height above caller hedge m",
      kind: "numberList",
    },
    {
      id: "rectangularEnvelopeVolumeAboveCallerHedgeM3",
      label: "Rectangular envelope volume above caller hedge m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCanopyTopHeightsM:
        value.observedCanopyTopHeightsM as readonly number[],
      callerHedgeTopHeightsM: value.callerHedgeTopHeightsM as readonly number[],
      canopyBottomHeightsM: value.canopyBottomHeightsM as readonly number[],
      canopyWidthsM: value.canopyWidthsM as readonly number[],
      representedRowLengthsM: value.representedRowLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
