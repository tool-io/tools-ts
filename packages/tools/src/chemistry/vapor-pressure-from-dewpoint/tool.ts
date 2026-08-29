import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const A_MAGNUS = 17.625;
const B_MAGNUS = 243.04;
const REFERENCE_VAPOR_PRESSURE_HPA = 6.112;

export const vaporPressureFromDewpointExample = {
  input: { temperatureC: 20 },
} satisfies ToolExample<{
  readonly temperatureC: number;
}>;

export const vaporPressureFromDewpointTool = createSimpleTool({
  id: "chemistry/vapor-pressure-from-dewpoint",
  title: "Vapor Pressure From Dewpoint",
  description:
    "Compute water vapor pressure from dewpoint temperature using the Magnus formula.",
  inputs: [
    {
      id: "temperatureC",
      label: "Dewpoint temperature",
      kind: "number",
      maximum: 60,
      minimum: -80,
      unit: "\u00B0C",
    },
  ],
  outputs: [
    {
      id: "vaporPressureHpa",
      label: "Vapor pressure",
      kind: "number",
      unit: "hPa",
    },
  ],
  calculate: (input) => {
    const temperatureC = input.temperatureC as number;
    return {
      vaporPressureHpa:
        REFERENCE_VAPOR_PRESSURE_HPA *
        Math.exp((A_MAGNUS * temperatureC) / (B_MAGNUS + temperatureC)),
    };
  },
});
export const runVaporPressureFromDewpoint =
  vaporPressureFromDewpointTool.execute;
export default vaporPressureFromDewpointTool;
