import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const maxPowerLoadExample = {
  input: { sourceResistanceOhms: 50 },
} satisfies ToolExample<{
  readonly sourceResistanceOhms: number;
}>;

export const maxPowerLoadTool = createSimpleTool({
  id: "electronics/max-power-load",
  title: "Max Power Load",
  description:
    "Find the load resistance in ohms that absorbs maximum power from a source, equal to the source resistance by the maximum power transfer theorem.",
  inputs: [
    { id: "sourceResistanceOhms", label: "Source resistance", kind: "number" },
  ],
  outputs: [
    {
      id: "loadForMaxPowerOhms",
      label: "Load for maximum power",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const sourceResistanceOhms = input.sourceResistanceOhms as number;
    if (sourceResistanceOhms <= 0)
      simpleError(
        "sourceResistanceOhms",
        "Source resistance must be greater than zero.",
      );
    return { loadForMaxPowerOhms: sourceResistanceOhms };
  },
});
export const runMaxPowerLoad = maxPowerLoadTool.execute;
export default maxPowerLoadTool;
