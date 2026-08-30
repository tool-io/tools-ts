import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cutProductIntensity: number;
  readonly uncutProductIntensity: number;
  readonly minimumRetentionPercent: number;
}>;
export type Output = Readonly<{
  readonly totalIntensity: number;
  readonly cutRetentionPercent: number;
  readonly retained: boolean;
}>;

export const calculate = (input: Input): Output => {
  const totalIntensity =
    input.cutProductIntensity + input.uncutProductIntensity;
  if (totalIntensity <= 0)
    simpleError(
      "cutProductIntensity",
      "Total product intensity must be positive.",
      "zero_intensity",
    );
  const cutRetentionPercent =
    (input.cutProductIntensity / totalIntensity) * 100;
  return {
    totalIntensity,
    cutRetentionPercent,
    retained: cutRetentionPercent >= input.minimumRetentionPercent,
  };
};

export const exampleInput = {
  cutProductIntensity: 75,
  uncutProductIntensity: 25,
  minimumRetentionPercent: 70,
} satisfies Input;
export const exampleOutput = {
  totalIntensity: 100,
  cutRetentionPercent: 75,
  retained: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cutProductIntensity: input.cutProductIntensity as number,
      uncutProductIntensity: input.uncutProductIntensity as number,
      minimumRetentionPercent: input.minimumRetentionPercent as number,
    }),
  description:
    "Calculate COBRA restriction cut-site retention from band intensities.",
  id: "epigenetics/cobra-retention",
  inputs: [
    {
      id: "cutProductIntensity",
      label: "Cut product intensity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "uncutProductIntensity",
      label: "Uncut product intensity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumRetentionPercent",
      label: "Minimum cut-site retention",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "totalIntensity",
      label: "Total product intensity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "cutRetentionPercent",
      label: "Cut-site retention",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "retained",
      label: "Meets supplied retention threshold",
      kind: "boolean",
    },
  ],
  title: "COBRA Retention",
});

export const run = tool.execute;
export default tool;
