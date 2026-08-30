import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly sliceBlockDurationsMs: readonly number[];
  readonly recoveryDelayMs: number;
  readonly configuredTrMs: number;
}>;
export type Output = Readonly<{
  readonly minimumTrMs: number;
  readonly trSlackMs: number;
  readonly fitsConfiguredTr: boolean;
}>;
const inputFields = [
  {
    id: "sliceBlockDurationsMs",
    label: "Slice block durations ms",
    kind: "numberList",
    unit: "ms",
  },
  {
    id: "recoveryDelayMs",
    label: "Recovery delay ms",
    kind: "number",
    unit: "ms",
  },
  {
    id: "configuredTrMs",
    label: "Configured tr ms",
    kind: "number",
    unit: "ms",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.sliceBlockDurationsMs.length)
    simpleError(
      "sliceBlockDurationsMs",
      "Nonempty nonoverlapping slice blocks required.",
    );
  input.sliceBlockDurationsMs.forEach((v) =>
    positive(v, "sliceBlockDurationsMs"),
  );
  nonnegative(input.recoveryDelayMs, "recoveryDelayMs");
  positive(input.configuredTrMs, "configuredTrMs");
  const minimumTrMs =
      input.sliceBlockDurationsMs.reduce((a, b) => a + b, 0) +
      input.recoveryDelayMs,
    trSlackMs = input.configuredTrMs - minimumTrMs;
  return { minimumTrMs, trSlackMs, fitsConfiguredTr: trSlackMs >= 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sliceBlockDurationsMs: [10, 20, 10],
  recoveryDelayMs: 60,
  configuredTrMs: 100,
} satisfies Input;
export const exampleOutput = {
  minimumTrMs: 100,
  trSlackMs: 0,
  fitsConfiguredTr: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/slice-block-repetition-time-budget",
  title: "Repetition Time TR",
  description:
    "Budget sequential nonoverlapping slice blocks plus recovery time within TR; simultaneous or interleaved waveform schedules are not inferred.",
  inputs: inputFields,
  outputs: [
    { id: "minimumTrMs", label: "Minimum tr ms", kind: "number", unit: "ms" },
    { id: "trSlackMs", label: "Tr slack ms", kind: "number", unit: "ms" },
    { id: "fitsConfiguredTr", label: "Fits configured tr", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sliceBlockDurationsMs: value.sliceBlockDurationsMs as readonly number[],
      recoveryDelayMs: value.recoveryDelayMs as number,
      configuredTrMs: value.configuredTrMs as number,
    }),
});
export const run = tool.execute;
export default tool;
