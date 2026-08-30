import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SonarTransmissionLossInput = Readonly<{
  readonly rangeMeters: number;
  readonly absorptionDbPerMeter: number;
}>;
export type SonarTransmissionLossOutput = Readonly<{
  readonly transmissionLossDb: number;
}>;

export const calculateSonarTransmissionLoss = (
  x: SonarTransmissionLossInput,
): SonarTransmissionLossOutput => {
  if (!Number.isFinite(x.rangeMeters) || x.rangeMeters < 1)
    simpleError("rangeMeters", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.absorptionDbPerMeter) || x.absorptionDbPerMeter < 0)
    simpleError("absorptionDbPerMeter", "Provide a finite number at least 0.");
  const transmissionLossDb =
    20 * Math.log10(x.rangeMeters) +
    x.absorptionDbPerMeter * (x.rangeMeters - 1);
  if (!Number.isFinite(transmissionLossDb))
    simpleError(
      "transmissionLossDb",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    transmissionLossDb: Object.is(transmissionLossDb, -0)
      ? 0
      : transmissionLossDb,
  };
};

export const example = {
  input: { rangeMeters: 100, absorptionDbPerMeter: 0.01 },
  output: { transmissionLossDb: 40.99 },
} satisfies ToolExample<
  SonarTransmissionLossInput,
  SonarTransmissionLossOutput
>;

export const tool = createSimpleTool({
  id: "electronics/sonar-transmission-loss",
  title: "Sonar Transmission Loss",
  description:
    "One-way sonar transmission loss using spherical spreading referenced to 1 m plus a supplied absorption rate.",
  inputs: [
    {
      id: "rangeMeters",
      kind: "number",
      label: "Range Meters",
      unit: "m",
      minimum: 1,
    },
    {
      id: "absorptionDbPerMeter",
      kind: "number",
      label: "Absorption Db Per Meter",
      unit: "dB/m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "transmissionLossDb",
      kind: "number",
      label: "Transmission Loss Db",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateSonarTransmissionLoss({
      rangeMeters: input.rangeMeters as number,
      absorptionDbPerMeter: input.absorptionDbPerMeter as number,
    }),
});
export const sonarTransmissionLossTool = tool;
export const runSonarTransmissionLoss = tool.execute;
export default tool;
