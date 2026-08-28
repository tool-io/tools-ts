import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const inhibitorEffectCheckerTool = createSimpleTool({
  id: "chemistry/inhibitor-effect-checker",
  title: "Inhibitor Effect Check",
  description: "Calculate inhibitor effect check.",
  inputs: [
    {
      description: "Inhibitor concentration.",
      id: "inhibitorConcentrationMolL",
      kind: "number",
      label: "[I]",
      minimum: 0,
    },
    {
      description: "Inhibition constant Ki.",
      id: "kiMolL",
      kind: "number",
      label: "Ki",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Remaining activity fraction.",
      id: "activityFraction",
      kind: "number",
      label: "Activity fraction",
    },
  ],
  calculate: (input) => {
    if ((input.kiMolL as number) <= 0)
      simpleError("kiMolL", ">0 required.", "invalid_ki");
    return {
      activityFraction:
        (input.kiMolL as number) /
        ((input.kiMolL as number) +
          (input.inhibitorConcentrationMolL as number)),
    };
  },
});
export default inhibitorEffectCheckerTool;
export const runInhibitorEffectChecker = inhibitorEffectCheckerTool.execute;

export type InhibitorEffectCheckerInput = {
  readonly inhibitorConcentrationMolL: number;
  readonly kiMolL: number;
};

export type InhibitorEffectCheckerOutput = {
  readonly activityFraction: number;
};

export const inhibitorEffectCheckerExample = {
  input: {
    inhibitorConcentrationMolL: 1,
    kiMolL: 1,
  },
  output: {
    activityFraction: 0.5,
  },
} satisfies ToolExample<
  InhibitorEffectCheckerInput,
  InhibitorEffectCheckerOutput
>;
