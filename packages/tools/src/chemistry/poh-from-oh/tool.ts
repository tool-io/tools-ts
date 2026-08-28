import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pohFromOhExample = {
  input: { oHMolPerL: 0.01 },
} satisfies ToolExample<{
  readonly oHMolPerL: number;
}>;

export const pohFromOhTool = createSimpleTool({
  id: "chemistry/poh-from-oh",
  title: "pOH From OH Minus",
  description:
    "Compute pOH as the negative base-10 logarithm of the hydroxide ion concentration.",
  inputs: [
    {
      id: "oHMolPerL",
      label: "Hydroxide ion concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  outputs: [{ id: "poh", label: "pOH", kind: "number" }],
  calculate: (input) => {
    const oHMolPerL = input.oHMolPerL as number;
    if (!(oHMolPerL > 0))
      simpleError("oHMolPerL", "Hydroxide ion concentration must be positive.");
    return { poh: -Math.log10(oHMolPerL) };
  },
});
export const runPohFromOh = pohFromOhTool.execute;
export default pohFromOhTool;
