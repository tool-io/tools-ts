import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const maxPowerDeliveredExample = {
  input: { theveninResistanceOhms: 50, theveninVoltage: 10 },
} satisfies ToolExample<{
  readonly theveninResistanceOhms: number;
  readonly theveninVoltage: number;
}>;

export const maxPowerDeliveredTool = createSimpleTool({
  id: "electronics/max-power-delivered",
  title: "Max Power Delivered",
  description:
    "Compute the maximum power in watts deliverable to a matched load from a Thevenin equivalent source.",
  inputs: [
    { id: "theveninVoltage", label: "Thevenin voltage", kind: "number" },
    {
      id: "theveninResistanceOhms",
      label: "Thevenin resistance",
      kind: "number",
    },
  ],
  outputs: [{ id: "maxPowerWatts", label: "Maximum power", kind: "number" }],
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
    return {
      maxPowerWatts:
        (theveninVoltage * theveninVoltage) / (4 * theveninResistanceOhms),
    };
  },
});
export const runMaxPowerDelivered = maxPowerDeliveredTool.execute;
export default maxPowerDeliveredTool;
