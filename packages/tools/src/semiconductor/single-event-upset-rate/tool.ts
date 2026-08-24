import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SingleEventUpsetRateInput = {
  readonly particleFluxPerCm2PerSecond: number;
  readonly sensitiveCrossSectionUm2: number;
};

export type SingleEventUpsetRateOutput = {
  readonly upsetsPerDay: number;
};

export const singleEventUpsetRateExample = {
  input: { particleFluxPerCm2PerSecond: 10, sensitiveCrossSectionUm2: 100 },
  output: { upsetsPerDay: 0.8640000000000001 },
} satisfies ToolExample<SingleEventUpsetRateInput, SingleEventUpsetRateOutput>;

export const singleEventUpsetRateTool = createSimpleTool({
  id: "semiconductor/single-event-upset-rate",
  title: "Single Event Upset Rate Calculator",
  description:
    "Estimate expected single event upsets per day from energetic particle flux and device sensitive cross section.",
  inputs: [
    {
      description:
        "Incident energetic particle flux at the device environment.",
      id: "particleFluxPerCm2PerSecond",
      kind: "number",
      label: "Particle flux",
      minimum: 0,
      unit: "1/(cm^2 s)",
    },
    {
      description: "Sensitive area of the node exposed to the flux.",
      id: "sensitiveCrossSectionUm2",
      kind: "number",
      label: "Sensitive cross section",
      minimum: 0,
      unit: "um^2",
    },
  ],
  outputs: [
    {
      id: "upsetsPerDay",
      kind: "number",
      label: "Upset rate",
      unit: "1/day",
    },
  ],
  calculate: (input) => ({
    upsetsPerDay:
      (input.particleFluxPerCm2PerSecond as number) *
      (input.sensitiveCrossSectionUm2 as number) *
      1e-8 *
      86400,
  }),
});
export const runSingleEventUpsetRate = singleEventUpsetRateTool.execute;
export default singleEventUpsetRateTool;
