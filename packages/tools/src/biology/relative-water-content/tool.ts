import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelativeWaterContentInput = {
  readonly dryMassG: number;
  readonly freshMassG: number;
  readonly turgidMassG: number;
};

export type RelativeWaterContentOutput = {
  readonly relativeWaterContentPercent: number;
};

export const relativeWaterContentExample = {
  input: { dryMassG: 4, freshMassG: 8, turgidMassG: 10 },
  output: { relativeWaterContentPercent: 66.66666666666666 },
} satisfies ToolExample<RelativeWaterContentInput, RelativeWaterContentOutput>;

export const relativeWaterContentTool = createSimpleTool({
  id: "biology/relative-water-content",
  title: "RWC Percent",
  description:
    "Compute relative water content as (fresh mass - dry mass) / (turgid mass - dry mass) times 100, requiring the turgid mass to exceed the dry mass and the fresh mass to lie between them.",
  inputs: [
    {
      description: "Dry mass in grams.",
      id: "dryMassG",
      kind: "number",
      label: "Dry mass",
      unit: "g",
    },
    {
      description:
        "Fresh mass in grams; must lie between the dry and turgid masses.",
      id: "freshMassG",
      kind: "number",
      label: "Fresh mass",
      unit: "g",
    },
    {
      description: "Turgid mass in grams; must exceed the dry mass.",
      id: "turgidMassG",
      kind: "number",
      label: "Turgid mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Relative water content percentage between 0 and 100.",
      id: "relativeWaterContentPercent",
      kind: "number",
      label: "Relative water content",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const dryMassG = input.dryMassG as number;
    const freshMassG = input.freshMassG as number;
    const turgidMassG = input.turgidMassG as number;
    if (!(turgidMassG > dryMassG))
      simpleError(
        "turgidMassG",
        "The turgid mass must be greater than the dry mass.",
        "equal_masses",
      );
    if (!(freshMassG >= dryMassG && freshMassG <= turgidMassG))
      simpleError(
        "freshMassG",
        "The fresh mass must lie between the dry and turgid masses.",
        "invalid_masses",
      );
    return {
      relativeWaterContentPercent:
        ((freshMassG - dryMassG) / (turgidMassG - dryMassG)) * 100,
    };
  },
});
export const runRelativeWaterContent = relativeWaterContentTool.execute;
export default relativeWaterContentTool;
