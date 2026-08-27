import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const therapeuticWindowExample = {
  input: { effectiveThresholdMgdl: 8, toxicThresholdMgdl: 20 },
  output: { windowWidth: 12 },
} satisfies ToolExample<
  {
    readonly effectiveThresholdMgdl: number;
    readonly toxicThresholdMgdl: number;
  },
  { readonly windowWidth: number }
>;

export const therapeuticWindowTool = createSimpleTool({
  id: "biology/therapeutic-window",
  title: "Therapeutic Window Width",
  description:
    "Measure the width of the therapeutic window as the toxic blood threshold minus the effective blood threshold, both in milligrams per decilitre.",
  inputs: [
    {
      description: "Lowest concentration with therapeutic effect, in mg/dL.",
      id: "effectiveThresholdMgdl",
      label: "Effective threshold",
      kind: "number",
      unit: "mg/dL",
    },
    {
      description:
        "Lowest concentration with toxic effects, in mg/dL; must exceed the effective threshold.",
      id: "toxicThresholdMgdl",
      label: "Toxic threshold",
      kind: "number",
      unit: "mg/dL",
    },
  ],
  outputs: [
    {
      description: "Width of the therapeutic range in mg/dL.",
      id: "windowWidth",
      label: "Window width",
      kind: "number",
      unit: "mg/dL",
    },
  ],
  calculate: (input) => {
    const effectiveThresholdMgdl = input.effectiveThresholdMgdl as number;
    const toxicThresholdMgdl = input.toxicThresholdMgdl as number;
    if (!(toxicThresholdMgdl > effectiveThresholdMgdl))
      simpleError(
        "toxicThresholdMgdl",
        "The toxic threshold must be greater than the effective threshold.",
        "invalid_thresholds",
      );
    return { windowWidth: toxicThresholdMgdl - effectiveThresholdMgdl };
  },
});
export const runTherapeuticWindow = therapeuticWindowTool.execute;
export default therapeuticWindowTool;
