import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly line1MethylationPercent: number;
  readonly calibrationSlope: number;
  readonly calibrationInterceptPercent: number;
}>;
export type Output = Readonly<{
  readonly estimatedGlobalMethylationPercent: number;
  readonly calibrationAdjustmentPoints: number;
}>;

export const calculate = (input: Input): Output => {
  const estimatedGlobalMethylationPercent =
    input.line1MethylationPercent * input.calibrationSlope +
    input.calibrationInterceptPercent;
  return {
    estimatedGlobalMethylationPercent,
    calibrationAdjustmentPoints:
      estimatedGlobalMethylationPercent - input.line1MethylationPercent,
  };
};

export const exampleInput = {
  line1MethylationPercent: 70,
  calibrationSlope: 0.8,
  calibrationInterceptPercent: 10,
} satisfies Input;
export const exampleOutput = {
  estimatedGlobalMethylationPercent: 66,
  calibrationAdjustmentPoints: -4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      line1MethylationPercent: input.line1MethylationPercent as number,
      calibrationSlope: input.calibrationSlope as number,
      calibrationInterceptPercent: input.calibrationInterceptPercent as number,
    }),
  description:
    "Apply a caller-supplied calibration to a LINE-1 global methylation proxy.",
  id: "epigenetics/global-methylation-proxy",
  inputs: [
    {
      id: "line1MethylationPercent",
      label: "LINE-1 methylation",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "calibrationSlope", label: "Calibration slope", kind: "number" },
    {
      id: "calibrationInterceptPercent",
      label: "Calibration intercept",
      kind: "number",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "estimatedGlobalMethylationPercent",
      label: "Estimated global methylation",
      kind: "number",
      unit: "%",
    },
    {
      id: "calibrationAdjustmentPoints",
      label: "Calibration adjustment",
      kind: "number",
      unit: "percentage points",
    },
  ],
  title: "Global Methylation Proxy",
});

export const run = tool.execute;
export default tool;
