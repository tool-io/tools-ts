import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  band,
  ordered,
  median,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedFlipchipGapSamplesMicron: readonly number[];
  readonly callerMinimumStandoffMicron: number;
  readonly callerMaximumStandoffMicron: number;
}>;
export type Output = Readonly<{
  readonly observedMinimumStandoffMicron: number;
  readonly observedMedianStandoffMicron: number;
  readonly observedMaximumStandoffMicron: number;
  readonly standoffSamplesOutsideCallerRange: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFlipchipGapSamplesMicron",
    label: "Observed flipchip gap samples micron",
    kind: "numberList",
  },
  {
    id: "callerMinimumStandoffMicron",
    label: "Caller minimum standoff micron",
    kind: "number",
  },
  {
    id: "callerMaximumStandoffMicron",
    label: "Caller maximum standoff micron",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFlipchipGapSamplesMicron.forEach((v) =>
    positive(v, "observedFlipchipGapSamplesMicron"),
  );
  nonnegative(input.callerMinimumStandoffMicron, "callerMinimumStandoffMicron");
  nonnegative(input.callerMaximumStandoffMicron, "callerMaximumStandoffMicron");
  ordered(input.callerMinimumStandoffMicron, input.callerMaximumStandoffMicron);
  return {
    observedMinimumStandoffMicron: Math.min(
      ...input.observedFlipchipGapSamplesMicron,
    ),
    observedMedianStandoffMicron: median(
      input.observedFlipchipGapSamplesMicron,
    ),
    observedMaximumStandoffMicron: Math.max(
      ...input.observedFlipchipGapSamplesMicron,
    ),
    standoffSamplesOutsideCallerRange:
      input.observedFlipchipGapSamplesMicron.flatMap((v, i) =>
        band(
          v,
          input.callerMinimumStandoffMicron,
          input.callerMaximumStandoffMicron,
        ) < 0
          ? [i]
          : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFlipchipGapSamplesMicron: [10, 12, 14],
  callerMinimumStandoffMicron: 11,
  callerMaximumStandoffMicron: 15,
} satisfies Input;
export const exampleOutput = {
  observedMinimumStandoffMicron: 10,
  observedMedianStandoffMicron: 12,
  observedMaximumStandoffMicron: 14,
  standoffSamplesOutsideCallerRange: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/flip-chip-stand-off-height",
  title: "Semiconductor Flip Chip Stand Off Height Calculator",
  description:
    "Audit actual flip-chip installed stand-off distribution against explicit caller gap bounds, not geometric nominal bump height or board reliability assertion.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMinimumStandoffMicron",
      label: "Observed minimum standoff micron",
      kind: "number",
    },
    {
      id: "observedMedianStandoffMicron",
      label: "Observed median standoff micron",
      kind: "number",
    },
    {
      id: "observedMaximumStandoffMicron",
      label: "Observed maximum standoff micron",
      kind: "number",
    },
    {
      id: "standoffSamplesOutsideCallerRange",
      label: "Standoff samples outside caller range",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFlipchipGapSamplesMicron:
        value.observedFlipchipGapSamplesMicron as readonly number[],
      callerMinimumStandoffMicron: value.callerMinimumStandoffMicron as number,
      callerMaximumStandoffMicron: value.callerMaximumStandoffMicron as number,
    }),
});
export const run = tool.execute;
export default tool;
