import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly controlProximal: number;
  readonly controlDistal: number;
  readonly treatmentProximal: number;
  readonly treatmentDistal: number;
  readonly minimumUsageShiftPoints: number;
}>;
export type Output = Readonly<{
  readonly controlProximalPercent: number;
  readonly treatmentProximalPercent: number;
  readonly shiftPoints: number;
  readonly shifted: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = input.controlProximal + input.controlDistal,
    b = input.treatmentProximal + input.treatmentDistal;
  if (
    a <= 0 ||
    b <= 0 ||
    Math.min(
      input.controlProximal,
      input.controlDistal,
      input.treatmentProximal,
      input.treatmentDistal,
    ) < 0
  )
    simpleError(
      "controlProximal",
      "Nonnegative site counts with positive totals required.",
    );
  const controlProximalPercent = (input.controlProximal / a) * 100,
    treatmentProximalPercent = (input.treatmentProximal / b) * 100,
    shiftPoints = treatmentProximalPercent - controlProximalPercent;
  return {
    controlProximalPercent,
    treatmentProximalPercent,
    shiftPoints,
    shifted: Math.abs(shiftPoints) >= input.minimumUsageShiftPoints,
  };
};

export const exampleInput = {
  controlProximal: 40,
  controlDistal: 60,
  treatmentProximal: 70,
  treatmentDistal: 30,
  minimumUsageShiftPoints: 20,
} satisfies Input;
export const exampleOutput = {
  controlProximalPercent: 40,
  treatmentProximalPercent: 70,
  shiftPoints: 30,
  shifted: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/polya-usage-shift",
  title: "Polya Usage Shift",
  description:
    "Detect proximal polyadenylation usage shifts between conditions.",
  inputs: [
    { id: "controlProximal", kind: "number", label: "Control proximal" },
    { id: "controlDistal", kind: "number", label: "Control distal" },
    { id: "treatmentProximal", kind: "number", label: "Treatment proximal" },
    { id: "treatmentDistal", kind: "number", label: "Treatment distal" },
    {
      id: "minimumUsageShiftPoints",
      kind: "number",
      label: "Minimum usage shift points",
    },
  ],
  outputs: [
    {
      id: "controlProximalPercent",
      kind: "number",
      label: "Control proximal percent",
    },
    {
      id: "treatmentProximalPercent",
      kind: "number",
      label: "Treatment proximal percent",
    },
    { id: "shiftPoints", kind: "number", label: "Shift points" },
    { id: "shifted", kind: "boolean", label: "Shifted" },
  ],
  calculate: (value) =>
    calculate({
      controlProximal: value.controlProximal as number,
      controlDistal: value.controlDistal as number,
      treatmentProximal: value.treatmentProximal as number,
      treatmentDistal: value.treatmentDistal as number,
      minimumUsageShiftPoints: value.minimumUsageShiftPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
