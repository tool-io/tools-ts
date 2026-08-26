import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WinchPowerRatioInput = {
  readonly drumDiameterMm: number;
  readonly gearRatio?: number;
  readonly handleLengthMm?: number;
};

export type WinchPowerRatioOutput = {
  readonly powerRatio: number;
};

const DEFAULT_HANDLE_LENGTH_MM = 250;
const DEFAULT_GEAR_RATIO = 4.4;

export const winchPowerRatioExample = {
  input: { drumDiameterMm: 100 },
  output: { powerRatio: 22 },
} satisfies ToolExample<WinchPowerRatioInput, WinchPowerRatioOutput>;

export const calculateWinchPowerRatio = (
  input: WinchPowerRatioInput,
): WinchPowerRatioOutput => {
  if (input.drumDiameterMm <= 0)
    simpleError(
      "drumDiameterMm",
      "The drum diameter must be positive.",
      "invalid_input",
    );
  const handleLengthMm = input.handleLengthMm ?? DEFAULT_HANDLE_LENGTH_MM;
  const gearRatio = input.gearRatio ?? DEFAULT_GEAR_RATIO;
  return {
    powerRatio: (2 * handleLengthMm * gearRatio) / input.drumDiameterMm,
  };
};

export const winchPowerRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateWinchPowerRatio(input as unknown as WinchPowerRatioInput),
  description:
    "Compute ideal winch mechanical advantage as the handle-to-drum radius ratio multiplied by the dimensionless gear ratio. Real handle force is higher because this ideal model excludes friction.",
  id: "sailing/winch-power-ratio",
  inputs: [
    {
      description: "Effective diameter of the winch drum.",
      format: "length-mm",
      id: "drumDiameterMm",
      kind: "number",
      label: "Drum diameter",
      unit: "mm",
    },
    {
      default: DEFAULT_GEAR_RATIO,
      description:
        "Dimensionless output-to-input gear ratio for the selected winch speed.",
      id: "gearRatio",
      kind: "number",
      label: "Gear ratio",
      maximum: 20,
      minimum: 1,
    },
    {
      default: DEFAULT_HANDLE_LENGTH_MM,
      description: "Length of the winch handle from center to grip.",
      format: "length-mm",
      id: "handleLengthMm",
      kind: "number",
      label: "Handle length",
      maximum: 400,
      minimum: 150,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Mechanical advantage of the winch; each newton at the handle holds this many newtons on the sheet.",
      format: "ratio",
      id: "powerRatio",
      kind: "number",
      label: "Power ratio",
    },
  ],
  title: "Winch Power Ratio Calculator",
});
export const runWinchPowerRatio = winchPowerRatioTool.execute;
export default winchPowerRatioTool;
