import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { slope: 0.8, intercept: 0.2 },
  output: { monolayerCapacity: 1, betConstant: 5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/bet-isotherm-monolayer",
  title: "BET Monolayer Capacity",
  description:
    "Derive BET monolayer capacity and BET C constant from the slope and intercept of a correctly prepared BET linear plot. Both must be positive for this form; choosing a valid relative-pressure range remains the analyst's responsibility.",
  inputs: [
    {
      id: "slope",
      kind: "number",
      label: "BET plot slope",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "intercept",
      kind: "number",
      label: "BET plot intercept",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "monolayerCapacity", kind: "number", label: "Monolayer Capacity" },
    { id: "betConstant", kind: "number", label: "Bet Constant" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      monolayerCapacity: 1 / (i.slope + i.intercept),
      betConstant: 1 + i.slope / i.intercept,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type BetIsothermMonolayerInput = Readonly<typeof example.input>;
export type BetIsothermMonolayerOutput = Readonly<typeof example.output>;
export const betIsothermMonolayerTool = tool;
export const runBetIsothermMonolayer = tool.execute;
export default tool;
