import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const digitizerInputLoadingErrorPercentCalculatorExample = {
  input: { sensorOutputImpedanceKOhm: 1, inputImpedanceMOhm: 10 },
  output: {
    loadingErrorPercent: 0.009999000099990002,
    acceptableBelow01Percent: true,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const digitizerInputLoadingErrorPercentCalculatorTool = createSimpleTool(
  {
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ sensorOutputImpedanceKOhm, inputImpedanceMOhm }) => {
        const rs = sensorOutputImpedanceKOhm * 1e3;
        const rin = inputImpedanceMOhm * 1e6;
        if (rin <= 0)
          simpleError(
            "inputImpedanceMOhm",
            "Input impedance must be positive.",
          );
        const err = Math.abs(rs / (rs + rin)) * 100;
        return {
          loadingErrorPercent: err,
          acceptableBelow01Percent: err < 0.1,
        };
      })(input as never) as Record<string, unknown>,
    description:
      "Voltage divider loading error when a sensor drives the digitizer input impedance.",
    id: "seismology/digitizer-input-loading-error-percent-calculator",
    inputs: [
      {
        minimum: 0,
        description: "Sensor output impedance.",
        id: "sensorOutputImpedanceKOhm",
        kind: "number",
        label: "R_s",
        unit: "kΩ",
      },
      {
        minimum: 0,
        description: "Digitizer input impedance.",
        id: "inputImpedanceMOhm",
        kind: "number",
        label: "R_in",
        unit: "MΩ",
      },
    ],
    outputs: [
      {
        description: "Magnitude of the amplitude error.",
        id: "loadingErrorPercent",
        kind: "number",
        label: "ε%",
        unit: "%",
      },
      {
        description: "Whether loading stays under 0.1 percent.",
        id: "acceptableBelow01Percent",
        kind: "boolean",
        label: "<0.1%?",
      },
    ],
    title: "Digitizer Input Loading Error Percent Calculator",
  },
);
export const runDigitizerInputLoadingErrorPercentCalculator =
  digitizerInputLoadingErrorPercentCalculatorTool.execute;
export { digitizerInputLoadingErrorPercentCalculatorExample as example };
export default digitizerInputLoadingErrorPercentCalculatorTool;
