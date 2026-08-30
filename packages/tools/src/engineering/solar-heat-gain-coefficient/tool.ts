import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarHeatGainCoefficientInput = Readonly<{
  readonly transmittedWatts: number;
  readonly inwardAbsorbedWatts: number;
  readonly incidentWatts: number;
}>;
export type SolarHeatGainCoefficientOutput = Readonly<{
  readonly solarHeatGainCoefficient: number;
}>;

export const calculateSolarHeatGainCoefficient = (
  x: SolarHeatGainCoefficientInput,
): SolarHeatGainCoefficientOutput => {
  if (!Number.isFinite(x.transmittedWatts) || x.transmittedWatts < 0)
    simpleError("transmittedWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.inwardAbsorbedWatts) || x.inwardAbsorbedWatts < 0)
    simpleError("inwardAbsorbedWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.incidentWatts) || x.incidentWatts < 0)
    simpleError("incidentWatts", "Provide a finite number at least 0.");
  if (x.transmittedWatts + x.inwardAbsorbedWatts > x.incidentWatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const solarHeatGainCoefficient =
    (x.transmittedWatts + x.inwardAbsorbedWatts) / x.incidentWatts;
  if (!Number.isFinite(solarHeatGainCoefficient))
    simpleError(
      "solarHeatGainCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    solarHeatGainCoefficient: Object.is(solarHeatGainCoefficient, -0)
      ? 0
      : solarHeatGainCoefficient,
  };
};

export const example = {
  input: {
    transmittedWatts: 300,
    inwardAbsorbedWatts: 50,
    incidentWatts: 1000,
  },
  output: { solarHeatGainCoefficient: 0.35 },
} satisfies ToolExample<
  SolarHeatGainCoefficientInput,
  SolarHeatGainCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "engineering/solar-heat-gain-coefficient",
  title: "Solar Heat Gain Coefficient",
  description:
    "Solar heat-gain coefficient from transmitted solar heat plus inward-flowing absorbed heat divided by incident solar energy.",
  inputs: [
    {
      id: "transmittedWatts",
      kind: "number",
      label: "Transmitted Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "inwardAbsorbedWatts",
      kind: "number",
      label: "Inward Absorbed Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "incidentWatts",
      kind: "number",
      label: "Incident Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "solarHeatGainCoefficient",
      kind: "number",
      label: "Solar Heat Gain Coefficient",
    },
  ],
  calculate: (input) =>
    calculateSolarHeatGainCoefficient({
      transmittedWatts: input.transmittedWatts as number,
      inwardAbsorbedWatts: input.inwardAbsorbedWatts as number,
      incidentWatts: input.incidentWatts as number,
    }),
});
export const solarHeatGainCoefficientTool = tool;
export const runSolarHeatGainCoefficient = tool.execute;
export default tool;
