import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCatchBasinInflowLitersSecond: number;
  readonly callerRetentionSeconds: number;
  readonly observedSedimentReservedLiters: number;
  readonly callerUsableVolumeFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredCatchBasinUsableLiters: number;
  readonly requiredNominalCatchBasinLiters: number;
}>;
const inputFields = [
  {
    id: "observedCatchBasinInflowLitersSecond",
    label: "Observed catch basin inflow liters second",
    kind: "number",
  },
  {
    id: "callerRetentionSeconds",
    label: "Caller retention seconds",
    kind: "number",
  },
  {
    id: "observedSedimentReservedLiters",
    label: "Observed sediment reserved liters",
    kind: "number",
  },
  {
    id: "callerUsableVolumeFraction",
    label: "Caller usable volume fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerUsableVolumeFraction, "callerUsableVolumeFraction");
  nonnegative(
    input.observedCatchBasinInflowLitersSecond,
    "observedCatchBasinInflowLitersSecond",
  );
  nonnegative(input.callerRetentionSeconds, "callerRetentionSeconds");
  nonnegative(
    input.observedSedimentReservedLiters,
    "observedSedimentReservedLiters",
  );
  fraction(input.callerUsableVolumeFraction, "callerUsableVolumeFraction");
  const volume =
    input.observedCatchBasinInflowLitersSecond * input.callerRetentionSeconds +
    input.observedSedimentReservedLiters;
  return {
    requiredCatchBasinUsableLiters: volume,
    requiredNominalCatchBasinLiters: volume / input.callerUsableVolumeFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCatchBasinInflowLitersSecond: 10,
  callerRetentionSeconds: 30,
  observedSedimentReservedLiters: 50,
  callerUsableVolumeFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  requiredCatchBasinUsableLiters: 350,
  requiredNominalCatchBasinLiters: 437.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/catch-basin-size",
  title: "Plumbing Catch Basin Size Calculator",
  description:
    "Budget measured catch-basin inlet rate, caller retention and independently reserved sediment volume; no inferred inlet-grate capture, universal civil design or overflow safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredCatchBasinUsableLiters",
      label: "Required catch basin usable liters",
      kind: "number",
    },
    {
      id: "requiredNominalCatchBasinLiters",
      label: "Required nominal catch basin liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCatchBasinInflowLitersSecond:
        value.observedCatchBasinInflowLitersSecond as number,
      callerRetentionSeconds: value.callerRetentionSeconds as number,
      observedSedimentReservedLiters:
        value.observedSedimentReservedLiters as number,
      callerUsableVolumeFraction: value.callerUsableVolumeFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
