import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const junctionTemperatureExample = {
  input: { ambientTempC: 25, powerWatts: 2, thetaCPerW: 30 },
  output: { junctionTempC: 85 },
} satisfies ToolExample<
  {
    readonly ambientTempC: number;
    readonly powerWatts: number;
    readonly thetaCPerW: number;
  },
  { readonly junctionTempC: number }
>;

export const junctionTemperatureTool = createSimpleTool({
  calculate: (input) => ({
    junctionTempC:
      (input.ambientTempC as number) +
      (input.powerWatts as number) * (input.thetaCPerW as number),
  }),
  description:
    "Estimate the semiconductor junction temperature from ambient temperature, dissipated power and thermal resistance.",
  id: "electronics/junction-temperature",
  inputs: [
    {
      id: "ambientTempC",
      kind: "number",
      label: "Ambient temperature",
      unit: "°C",
    },
    { id: "powerWatts", kind: "number", label: "Power dissipation", unit: "W" },
    {
      id: "thetaCPerW",
      kind: "number",
      label: "Thermal resistance",
      unit: "°C/W",
    },
  ],
  outputs: [
    {
      id: "junctionTempC",
      kind: "number",
      label: "Junction temperature",
      unit: "°C",
    },
  ],
  title: "Junction Temperature",
});
export const runJunctionTemperature = junctionTemperatureTool.execute;
export default junctionTemperatureTool;
