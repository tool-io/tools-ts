import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ethernetMagneticsTurnsRatioExample = {
  input: { lineImpedanceOhms: 100, portImpedanceOhms: 25 },
} satisfies ToolExample<{
  readonly lineImpedanceOhms: number;
  readonly portImpedanceOhms: number;
}>;

export const ethernetMagneticsTurnsRatioTool = createSimpleTool({
  id: "electronics/ethernet-magnetics-turns-ratio",
  title: "Ethernet Turns Ratio",
  description:
    "Compute the transformer turns ratio of Ethernet magnetics from the line-side and port-side impedances as the square root of their ratio.",
  inputs: [
    {
      id: "lineImpedanceOhms",
      label: "Line-side impedance",
      kind: "number",
      unit: "\u03a9",
    },
    {
      id: "portImpedanceOhms",
      label: "Port-side impedance",
      kind: "number",
      unit: "\u03a9",
    },
  ],
  outputs: [
    {
      id: "turnsRatio",
      label: "Turns ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const lineImpedanceOhms = input.lineImpedanceOhms as number;
    const portImpedanceOhms = input.portImpedanceOhms as number;
    if (!(lineImpedanceOhms > 0))
      simpleError(
        "lineImpedanceOhms",
        "Line-side impedance must be positive.",
        "invalid_impedance",
      );
    if (!(portImpedanceOhms > 0))
      simpleError(
        "portImpedanceOhms",
        "Port-side impedance must be positive.",
        "invalid_impedance",
      );
    return {
      turnsRatio: Math.sqrt(lineImpedanceOhms / portImpedanceOhms),
    };
  },
});
export const runEthernetMagneticsTurnsRatio =
  ethernetMagneticsTurnsRatioTool.execute;
export default ethernetMagneticsTurnsRatioTool;
