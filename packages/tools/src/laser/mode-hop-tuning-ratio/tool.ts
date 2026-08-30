import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly gratingTuningGhzPerVolt: number;
  readonly currentTuningGhzPerMilliamp: number;
}>;
export type Output = Readonly<{
  readonly currentPerVoltMilliamp: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.currentTuningGhzPerMilliamp === 0)
    simpleError(
      "currentTuningGhzPerMilliamp",
      "Current tuning sensitivity must not be zero.",
      "division_by_zero",
    );
  return {
    currentPerVoltMilliamp:
      input.gratingTuningGhzPerVolt / input.currentTuningGhzPerMilliamp,
  };
};

export const exampleInput = {
  gratingTuningGhzPerVolt: 10,
  currentTuningGhzPerMilliamp: 2,
} satisfies Input;
export const exampleOutput = { currentPerVoltMilliamp: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      gratingTuningGhzPerVolt: input.gratingTuningGhzPerVolt as number,
      currentTuningGhzPerMilliamp: input.currentTuningGhzPerMilliamp as number,
    }),
  description:
    "Calculate the current-to-grating tuning ratio needed for matched frequency change.",
  id: "laser/mode-hop-tuning-ratio",
  inputs: [
    {
      id: "gratingTuningGhzPerVolt",
      label: "Grating tuning sensitivity",
      kind: "number",
      unit: "GHz/V",
    },
    {
      id: "currentTuningGhzPerMilliamp",
      label: "Current tuning sensitivity",
      kind: "number",
      unit: "GHz/mA",
    },
  ],
  outputs: [
    {
      id: "currentPerVoltMilliamp",
      label: "Matched current change per volt",
      kind: "number",
      unit: "mA/V",
    },
  ],
  title: "Mode-Hop Tuning Ratio",
});

export const run = tool.execute;
export default tool;
