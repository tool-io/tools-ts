import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { appliedStress: 80, ratedStress: 100 },
  output: {
    deratingFraction: 0.19999999999999996,
    deratingPercent: 19.999999999999996,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/derating-factor",
  title: "Electrical Derating Margin",
  description:
    "Calculate remaining fraction of a component rating as 1−applied/rated, and its percentage. A negative result indicates the applied stress exceeds the selected rating.",
  inputs: [
    {
      id: "appliedStress",
      kind: "number",
      label: "Applied stress",
      minimum: 0,
    },
    {
      id: "ratedStress",
      kind: "number",
      label: "Rated stress",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "deratingFraction", kind: "number", label: "Derating Fraction" },
    { id: "deratingPercent", kind: "number", label: "Derating Percent" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      deratingFraction: 1 - i.appliedStress / i.ratedStress,
      deratingPercent: (1 - i.appliedStress / i.ratedStress) * 100,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type DeratingFactorInput = Readonly<typeof example.input>;
export type DeratingFactorOutput = Readonly<typeof example.output>;
export const deratingFactorTool = tool;
export const runDeratingFactor = tool.execute;
export default tool;
