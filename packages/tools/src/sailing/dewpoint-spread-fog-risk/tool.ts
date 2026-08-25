import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DewpointSpreadFogRiskInput = {
  readonly dewpointC: number;
  readonly tempC: number;
};

export type DewpointSpreadFogRiskOutput = {
  readonly fogRisk: boolean;
  readonly spreadCelsius: number;
};

export const dewpointSpreadFogRiskExample = {
  input: { dewpointC: 10.5, tempC: 12 },
  output: { fogRisk: true, spreadCelsius: 1.5 },
} satisfies ToolExample<
  DewpointSpreadFogRiskInput,
  DewpointSpreadFogRiskOutput
>;

export const calculateDewpointSpreadFogRisk = (
  input: DewpointSpreadFogRiskInput,
): DewpointSpreadFogRiskOutput => {
  const spreadCelsius = input.tempC - input.dewpointC;
  return { fogRisk: spreadCelsius <= 2, spreadCelsius };
};

export const dewpointSpreadFogRiskTool = createSimpleTool({
  calculate: (input) =>
    calculateDewpointSpreadFogRisk(
      input as unknown as DewpointSpreadFogRiskInput,
    ),
  description:
    "Assess fog risk from the temperature dew point spread; a spread of two degrees Celsius or less indicates conditions favourable for fog formation.",
  id: "sailing/dewpoint-spread-fog-risk",
  inputs: [
    {
      description: "Dew point temperature in degrees Celsius.",
      id: "dewpointC",
      kind: "number",
      label: "Dew point",
      unit: "°C",
    },
    {
      description: "Dry bulb air temperature in degrees Celsius.",
      id: "tempC",
      kind: "number",
      label: "Air temperature",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "True when the spread is small enough for fog to form.",
      id: "fogRisk",
      kind: "boolean",
      label: "Fog risk",
    },
    {
      description: "Temperature minus dew point in degrees Celsius.",
      id: "spreadCelsius",
      kind: "number",
      label: "Spread",
      unit: "°C",
    },
  ],
  title: "Fog Risk Spread Check",
});
export const runDewpointSpreadFogRisk = dewpointSpreadFogRiskTool.execute;
export default dewpointSpreadFogRiskTool;
