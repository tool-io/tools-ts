import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly launchedPhotons: number;
  readonly roundTripTransmission: number;
  readonly effectiveCrossSectionM2: number;
  readonly receiverAreaM2: number;
  readonly rangeMeters: number;
}>;
export type Output = Readonly<{
  readonly geometricCollectionFraction: number;
  readonly returnedPhotons: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.rangeMeters <= 0)
    simpleError("rangeMeters", "Range must be positive.", "invalid_range");
  const geometricCollectionFraction =
    (input.effectiveCrossSectionM2 * input.receiverAreaM2) /
    (4 * Math.PI * input.rangeMeters ** 2);
  return {
    geometricCollectionFraction,
    returnedPhotons:
      input.launchedPhotons *
      input.roundTripTransmission *
      geometricCollectionFraction,
  };
};

export const exampleInput = {
  launchedPhotons: 1256.6370614359173,
  roundTripTransmission: 0.5,
  effectiveCrossSectionM2: 1,
  receiverAreaM2: 1,
  rangeMeters: 10,
} satisfies Input;
export const exampleOutput = {
  geometricCollectionFraction: 0.0007957747154594767,
  returnedPhotons: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      launchedPhotons: input.launchedPhotons as number,
      roundTripTransmission: input.roundTripTransmission as number,
      effectiveCrossSectionM2: input.effectiveCrossSectionM2 as number,
      receiverAreaM2: input.receiverAreaM2 as number,
      rangeMeters: input.rangeMeters as number,
    }),
  description:
    "Estimate sodium guide-star photon return with a caller-supplied effective cross section.",
  id: "laser/guide-star-photon-return",
  inputs: [
    {
      id: "launchedPhotons",
      label: "Launched photons",
      kind: "number",
      minimum: 0,
    },
    {
      id: "roundTripTransmission",
      label: "Round-trip transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "effectiveCrossSectionM2",
      label: "Effective sodium cross section",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "receiverAreaM2",
      label: "Receiver area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "rangeMeters",
      label: "Guide-star range",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "geometricCollectionFraction",
      label: "Geometric collection fraction",
      kind: "number",
      minimum: 0,
    },
    {
      id: "returnedPhotons",
      label: "Expected returned photons",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Guide-Star Photon Return",
});

export const run = tool.execute;
export default tool;
