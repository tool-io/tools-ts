import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type TailwindLandingCheckInput = {
  readonly maxTailwindKt: number;
  readonly tailwindKt: number;
};

export type TailwindLandingCheckOutput = {
  readonly withinLimits: boolean;
};

export const tailwindLandingCheckExample = {
  input: { maxTailwindKt: 15, tailwindKt: 10 },
  output: { withinLimits: true },
} satisfies ToolExample<TailwindLandingCheckInput, TailwindLandingCheckOutput>;

export const calculateTailwindLandingCheck = (
  input: TailwindLandingCheckInput,
): TailwindLandingCheckOutput => ({
  withinLimits: input.tailwindKt <= input.maxTailwindKt,
});

export const tailwindLandingCheckTool = createSimpleTool({
  calculate: (input) =>
    calculateTailwindLandingCheck({
      maxTailwindKt: input.maxTailwindKt as number,
      tailwindKt: input.tailwindKt as number,
    }),
  description:
    "Check whether a runway tailwind component is at or below a supplied landing limit.",
  id: "aviation/tailwind-landing-check",
  inputs: [
    {
      description: "Tailwind component on the landing runway.",
      id: "tailwindKt",
      kind: "number",
      label: "Tailwind",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Maximum tailwind limit for landing.",
      id: "maxTailwindKt",
      kind: "number",
      label: "Max tailwind",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "True when the tailwind is within the limit.",
      id: "withinLimits",
      kind: "boolean",
      label: "Within limits",
    },
  ],
  title: "Tailwind Landing Check",
});
export const runTailwindLandingCheck = tailwindLandingCheckTool.execute;
export default tailwindLandingCheckTool;
