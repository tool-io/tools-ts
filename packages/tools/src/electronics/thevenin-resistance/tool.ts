import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const theveninResistanceExample = {
  input: { r1Ohms: 1000, r2Ohms: 2000 },
} satisfies ToolExample<{
  readonly r1Ohms: number;
  readonly r2Ohms: number;
}>;

export const theveninResistanceTool = createSimpleTool({
  id: "electronics/thevenin-resistance",
  title: "Thevenin Resistance",
  description:
    "Compute the Thevenin resistance in ohms of a resistive divider seen from its output.",
  inputs: [
    { id: "r1Ohms", label: "Resistance R1", kind: "number" },
    { id: "r2Ohms", label: "Resistance R2", kind: "number" },
  ],
  outputs: [
    {
      id: "theveninResistanceOhms",
      label: "Thevenin resistance",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const r1Ohms = input.r1Ohms as number;
    const r2Ohms = input.r2Ohms as number;
    if (r1Ohms <= 0) simpleError("r1Ohms", "R1 must be greater than zero.");
    if (r2Ohms <= 0) simpleError("r2Ohms", "R2 must be greater than zero.");
    return {
      theveninResistanceOhms: (r1Ohms * r2Ohms) / (r1Ohms + r2Ohms),
    };
  },
});
export const runTheveninResistance = theveninResistanceTool.execute;
export default theveninResistanceTool;
