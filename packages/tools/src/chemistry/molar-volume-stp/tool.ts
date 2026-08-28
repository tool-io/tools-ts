import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS_L_ATM = 0.08205736608096;

export const molarVolumeStpExample = {
  input: { measuredMolarVolumeML: 22400 },
} satisfies ToolExample<{
  readonly measuredMolarVolumeML: number;
}>;

export const molarVolumeStpTool = createSimpleTool({
  id: "chemistry/molar-volume-stp",
  title: "Molar Volume STP Check",
  description:
    "Compute the ideal molar volume at STP in milliliters per mole and the percent deviation of a measured molar volume from it.",
  inputs: [
    {
      id: "measuredMolarVolumeML",
      label: "Measured molar volume",
      kind: "number",
      unit: "mL/mol",
    },
  ],
  outputs: [
    {
      id: "stpMolarVolumeML",
      label: "STP molar volume",
      kind: "number",
      unit: "mL/mol",
    },
    { id: "deviationPercent", label: "Deviation", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const measuredMolarVolumeML = input.measuredMolarVolumeML as number;
    if (!(measuredMolarVolumeML > 0))
      simpleError(
        "measuredMolarVolumeML",
        "Measured molar volume must be positive.",
      );
    const computed = ((R_GAS_L_ATM * 273.15) / 1) * 1000;
    return {
      deviationPercent:
        (Math.abs(measuredMolarVolumeML - computed) / computed) * 100,
      stpMolarVolumeML: computed,
    };
  },
});
export const runMolarVolumeStp = molarVolumeStpTool.execute;
export default molarVolumeStpTool;
