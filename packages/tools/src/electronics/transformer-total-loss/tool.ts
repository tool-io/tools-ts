import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { copperLossW: 5, ironLossW: 3, otherLossW: 1 },
  output: { totalLossW: 9 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/transformer-total-loss",
  title: "Transformer Total Loss",
  description:
    "Add winding copper, core iron, and other measured transformer losses in watts. This is a loss budget sum, not an efficiency estimate without input or output power.",
  inputs: [
    { id: "copperLossW", kind: "number", label: "Copper loss (W)", minimum: 0 },
    { id: "ironLossW", kind: "number", label: "Iron loss (W)", minimum: 0 },
    { id: "otherLossW", kind: "number", label: "Other losses (W)", minimum: 0 },
  ],
  outputs: [{ id: "totalLossW", kind: "number", label: "Total Loss W" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { totalLossW: i.copperLossW + i.ironLossW + i.otherLossW };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type TransformerTotalLossInput = Readonly<typeof example.input>;
export type TransformerTotalLossOutput = Readonly<typeof example.output>;
export const transformerTotalLossTool = tool;
export const runTransformerTotalLoss = tool.execute;
export default tool;
