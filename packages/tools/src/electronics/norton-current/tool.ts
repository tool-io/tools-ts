import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nortonCurrentExample = {
  input: { theveninResistanceOhms: 50, theveninVoltage: 10 },
} satisfies ToolExample<{
  readonly theveninResistanceOhms: number;
  readonly theveninVoltage: number;
}>;

export const nortonCurrentTool = createSimpleTool({
  id: "electronics/norton-current",
  title: "Norton Current",
  description:
    "Compute the Norton source current in amperes from the Thevenin voltage and Thevenin resistance.",
  inputs: [
    { id: "theveninVoltage", label: "Thevenin voltage", kind: "number" },
    {
      id: "theveninResistanceOhms",
      label: "Thevenin resistance",
      kind: "number",
    },
  ],
  outputs: [
    { id: "nortonCurrentAmps", label: "Norton current", kind: "number" },
  ],
  calculate: (input) => {
    const theveninVoltage = input.theveninVoltage as number;
    const theveninResistanceOhms = input.theveninResistanceOhms as number;
    if (theveninVoltage <= 0)
      simpleError(
        "theveninVoltage",
        "Thevenin voltage must be greater than zero.",
      );
    if (theveninResistanceOhms <= 0)
      simpleError(
        "theveninResistanceOhms",
        "Thevenin resistance must be greater than zero.",
      );
    return { nortonCurrentAmps: theveninVoltage / theveninResistanceOhms };
  },
});
export const runNortonCurrent = nortonCurrentTool.execute;
export default nortonCurrentTool;
