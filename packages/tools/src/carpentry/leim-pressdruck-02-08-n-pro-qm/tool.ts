import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PressPressureSpecInput = {
  readonly pressureNPerMm2: number;
};

export type PressPressureSpecOutput = {
  readonly isInRange: boolean;
};

export const pressPressureSpecExample = {
  input: { pressureNPerMm2: 0.5 },
  output: { isInRange: true },
} satisfies ToolExample<PressPressureSpecInput, PressPressureSpecOutput>;

export const pressPressureSpecTool = createSimpleTool({
  id: "carpentry/leim-pressdruck-02-08-n-pro-qm",
  title: "Press Pressure Spec Check",
  description:
    "Check whether wood-laminating pressure lies within a typical 0.2 to 0.8 newtons per square millimetre range.",
  inputs: [
    {
      description:
        "Press pressure in newtons per square millimetre, between zero and three.",
      id: "pressureNPerMm2",
      kind: "number",
      label: "Press pressure",
      maximum: 3,
      minimum: 0,
      unit: "N/mm²",
    },
  ],
  outputs: [
    {
      description:
        "Whether the press pressure lies between 0.2 and 0.8 N/mm² inclusive.",
      id: "isInRange",
      kind: "boolean",
      label: "In range",
    },
  ],
  calculate: (input) => {
    const pressureNPerMm2 = input.pressureNPerMm2 as number;
    return { isInRange: pressureNPerMm2 >= 0.2 && pressureNPerMm2 <= 0.8 };
  },
});
export const runPressPressureSpec = pressPressureSpecTool.execute;
export default pressPressureSpecTool;
