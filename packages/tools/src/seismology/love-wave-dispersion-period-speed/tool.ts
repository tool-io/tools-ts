import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const loveWaveDispersionPeriodSpeedExample = {
  input: { periodSeconds: 20 },
  output: { phaseVelocityKmS: 3.6, regime: "intermediate-period dispersion" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const loveWaveDispersionPeriodSpeedTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ periodSeconds }) => {
      if (!(periodSeconds > 0))
        simpleError("periodSeconds", "Period must be positive.");
      const bands = [
        { max: 10, v: 3.9, note: "short-period branch near upper-crustal β" },
        { max: 30, v: 3.6, note: "intermediate-period dispersion" },
        {
          max: Infinity,
          v: 4.4,
          note: "long-period branch approaching mantle β",
        },
      ];
      const b = bands.find((x) => periodSeconds <= x.max)!;
      return { phaseVelocityKmS: b.v, regime: b.note };
    })(input as never) as Record<string, unknown>,
  description:
    "Illustrative fundamental-mode Love-wave phase-speed bands for a generic continental crust. Real dispersion must be calculated from a site-specific velocity model.",
  id: "seismology/love-wave-dispersion-period-speed",
  inputs: [
    {
      minimum: 0,
      description: "Period.",
      id: "periodSeconds",
      kind: "number",
      label: "T",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Phase velocity.",
      id: "phaseVelocityKmS",
      kind: "number",
      label: "c",
      unit: "km/s",
    },
    {
      description: "Dispersion regime note.",
      id: "regime",
      kind: "string",
      label: "Regime",
    },
  ],
  title: "Love Wave Dispersion Period Speed Lookup",
});
export const runLoveWaveDispersionPeriodSpeed =
  loveWaveDispersionPeriodSpeedTool.execute;
export { loveWaveDispersionPeriodSpeedExample as example };
export default loveWaveDispersionPeriodSpeedTool;
