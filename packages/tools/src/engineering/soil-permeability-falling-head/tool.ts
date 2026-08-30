import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoilPermeabilityFallingHeadInput = Readonly<{
  readonly standpipeAreaSquareMeters: number;
  readonly sampleLengthMeters: number;
  readonly sampleAreaSquareMeters: number;
  readonly elapsedSeconds: number;
  readonly initialHeadMeters: number;
  readonly finalHeadMeters: number;
}>;
export type SoilPermeabilityFallingHeadOutput = Readonly<{
  readonly conductivityMetersPerSecond: number;
}>;

export const calculateSoilPermeabilityFallingHead = (
  x: SoilPermeabilityFallingHeadInput,
): SoilPermeabilityFallingHeadOutput => {
  if (
    !Number.isFinite(x.standpipeAreaSquareMeters) ||
    x.standpipeAreaSquareMeters < 0
  )
    simpleError(
      "standpipeAreaSquareMeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.sampleLengthMeters) || x.sampleLengthMeters < 0)
    simpleError("sampleLengthMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.sampleAreaSquareMeters) ||
    x.sampleAreaSquareMeters < 0
  )
    simpleError(
      "sampleAreaSquareMeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds < 0)
    simpleError("elapsedSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.initialHeadMeters) || x.initialHeadMeters < 0)
    simpleError("initialHeadMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.finalHeadMeters) || x.finalHeadMeters < 0)
    simpleError("finalHeadMeters", "Provide a finite number at least 0.");
  if (x.initialHeadMeters <= x.finalHeadMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const conductivityMetersPerSecond =
    ((x.standpipeAreaSquareMeters * x.sampleLengthMeters) /
      (x.sampleAreaSquareMeters * x.elapsedSeconds)) *
    Math.log(x.initialHeadMeters / x.finalHeadMeters);
  if (!Number.isFinite(conductivityMetersPerSecond))
    simpleError(
      "conductivityMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    conductivityMetersPerSecond: Object.is(conductivityMetersPerSecond, -0)
      ? 0
      : conductivityMetersPerSecond,
  };
};

export const example = {
  input: {
    standpipeAreaSquareMeters: 0.0001,
    sampleLengthMeters: 0.1,
    sampleAreaSquareMeters: 0.01,
    elapsedSeconds: 100,
    initialHeadMeters: 1,
    finalHeadMeters: 0.5,
  },
  output: { conductivityMetersPerSecond: 0.000006931471805599453 },
} satisfies ToolExample<
  SoilPermeabilityFallingHeadInput,
  SoilPermeabilityFallingHeadOutput
>;

export const tool = createSimpleTool({
  id: "engineering/soil-permeability-falling-head",
  title: "Soil Permeability Falling Head",
  description:
    "Saturated hydraulic conductivity from a falling-head permeameter: k=(aL/At)ln(h1/h2).",
  inputs: [
    {
      id: "standpipeAreaSquareMeters",
      kind: "number",
      label: "Standpipe Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "sampleLengthMeters",
      kind: "number",
      label: "Sample Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "sampleAreaSquareMeters",
      kind: "number",
      label: "Sample Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "initialHeadMeters",
      kind: "number",
      label: "Initial Head Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "finalHeadMeters",
      kind: "number",
      label: "Final Head Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "conductivityMetersPerSecond",
      kind: "number",
      label: "Conductivity Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateSoilPermeabilityFallingHead({
      standpipeAreaSquareMeters: input.standpipeAreaSquareMeters as number,
      sampleLengthMeters: input.sampleLengthMeters as number,
      sampleAreaSquareMeters: input.sampleAreaSquareMeters as number,
      elapsedSeconds: input.elapsedSeconds as number,
      initialHeadMeters: input.initialHeadMeters as number,
      finalHeadMeters: input.finalHeadMeters as number,
    }),
});
export const soilPermeabilityFallingHeadTool = tool;
export const runSoilPermeabilityFallingHead = tool.execute;
export default tool;
