import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly hpaiiSignal: number;
  readonly mspiSignal: number;
  readonly controlRatio: number;
}>;
export type Output = Readonly<{
  readonly normalizedDigestionRatio: number;
  readonly estimatedMethylationPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.mspiSignal <= 0 || input.controlRatio <= 0)
    simpleError(
      "mspiSignal",
      "MspI signal and control ratio must be positive.",
      "invalid_reference",
    );
  const normalizedDigestionRatio =
    input.hpaiiSignal / input.mspiSignal / input.controlRatio;
  return {
    normalizedDigestionRatio,
    estimatedMethylationPercent: (1 - normalizedDigestionRatio) * 100,
  };
};

export const exampleInput = {
  hpaiiSignal: 25,
  mspiSignal: 100,
  controlRatio: 0.5,
} satisfies Input;
export const exampleOutput = {
  normalizedDigestionRatio: 0.5,
  estimatedMethylationPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      hpaiiSignal: input.hpaiiSignal as number,
      mspiSignal: input.mspiSignal as number,
      controlRatio: input.controlRatio as number,
    }),
  description:
    "Estimate LUMA methylation from normalized HpaII and MspI signals.",
  id: "epigenetics/luma-methylation",
  inputs: [
    { id: "hpaiiSignal", label: "HpaII signal", kind: "number", minimum: 0 },
    { id: "mspiSignal", label: "MspI signal", kind: "number", minimum: 0 },
    {
      id: "controlRatio",
      label: "Unmethylated control ratio",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "normalizedDigestionRatio",
      label: "Normalized digestion ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "estimatedMethylationPercent",
      label: "Estimated methylation",
      kind: "number",
      unit: "%",
    },
  ],
  title: "LUMA Methylation",
});

export const run = tool.execute;
export default tool;
