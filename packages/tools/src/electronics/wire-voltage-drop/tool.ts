import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WireVoltageDropInput = {
  readonly crossSectionMm2: number;
  readonly currentAmps: number;
  readonly resistivityOhmMm2PerM: number;
  readonly wireLengthMeters: number;
};

export type WireVoltageDropOutput = {
  readonly voltageDropV: number;
};

export const wireVoltageDropExample = {
  input: {
    crossSectionMm2: 1.5,
    currentAmps: 5,
    resistivityOhmMm2PerM: 0.0175,
    wireLengthMeters: 20,
  },
  output: { voltageDropV: 2.3333333333333335 },
} satisfies ToolExample<WireVoltageDropInput, WireVoltageDropOutput>;

export const wireVoltageDropTool = createSimpleTool({
  calculate: (input) => {
    const {
      crossSectionMm2,
      currentAmps,
      resistivityOhmMm2PerM,
      wireLengthMeters,
    } = input as unknown as WireVoltageDropInput;
    if (currentAmps <= 0)
      simpleError(
        "currentAmps",
        "Current must be positive.",
        "degenerate_input",
      );
    if (wireLengthMeters <= 0)
      simpleError(
        "wireLengthMeters",
        "Wire length must be positive.",
        "degenerate_input",
      );
    if (resistivityOhmMm2PerM <= 0)
      simpleError(
        "resistivityOhmMm2PerM",
        "Resistivity must be positive.",
        "degenerate_input",
      );
    if (crossSectionMm2 <= 0)
      simpleError(
        "crossSectionMm2",
        "Cross-section must be positive.",
        "degenerate_input",
      );
    return {
      voltageDropV:
        (currentAmps * 2 * wireLengthMeters * resistivityOhmMm2PerM) /
        crossSectionMm2,
    };
  },
  description:
    "Compute the round-trip voltage drop along a two-conductor wire run.",
  id: "electronics/wire-voltage-drop",
  inputs: [
    { id: "currentAmps", kind: "number", label: "Current", unit: "A" },
    { id: "wireLengthMeters", kind: "number", label: "Wire length", unit: "m" },
    {
      id: "resistivityOhmMm2PerM",
      kind: "number",
      label: "Wire resistivity",
      unit: "ohm*mm^2/m",
    },
    {
      id: "crossSectionMm2",
      kind: "number",
      label: "Cross-section",
      unit: "mm^2",
    },
  ],
  outputs: [
    { id: "voltageDropV", kind: "number", label: "Voltage drop", unit: "V" },
  ],
  title: "Wire Voltage Drop",
});
export const runWireVoltageDrop = wireVoltageDropTool.execute;
export default wireVoltageDropTool;
