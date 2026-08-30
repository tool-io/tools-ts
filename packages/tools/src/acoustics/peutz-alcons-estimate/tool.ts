import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly directivityFactor: number;
  readonly distanceMeters: number;
  readonly reverberationTimeSeconds: number;
  readonly roomVolumeCubicMeters: number;
}>;
export type Output = Readonly<{
  readonly cappedArticulationLossPercent: number;
  readonly rawArticulationLossPercent: number;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        field,
        "Inputs must be finite and positive.",
        "invalid_value",
      );
  const directArticulationLoss =
    (200 * input.distanceMeters ** 2 * input.reverberationTimeSeconds ** 2) /
    (input.roomVolumeCubicMeters * input.directivityFactor);
  const rawArticulationLossPercent =
    Number.isFinite(directArticulationLoss) && directArticulationLoss > 0
      ? directArticulationLoss
      : Math.exp(
          Math.log(200) +
            2 * Math.log(input.distanceMeters) +
            2 * Math.log(input.reverberationTimeSeconds) -
            Math.log(input.roomVolumeCubicMeters) -
            Math.log(input.directivityFactor),
        );
  if (
    !Number.isFinite(rawArticulationLossPercent) ||
    rawArticulationLossPercent <= 0
  )
    simpleError(
      "distanceMeters",
      "Inputs produce an out-of-range articulation-loss estimate.",
      "numeric_overflow",
    );
  return {
    rawArticulationLossPercent,
    cappedArticulationLossPercent: Math.min(100, rawArticulationLossPercent),
  };
};

export const example = {
  input: {
    directivityFactor: 2,
    distanceMeters: 10,
    reverberationTimeSeconds: 1,
    roomVolumeCubicMeters: 1000,
  },
  output: { rawArticulationLossPercent: 10, cappedArticulationLossPercent: 10 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    directivityFactor: 1,
    distanceMeters: 10,
    reverberationTimeSeconds: 2,
    roomVolumeCubicMeters: 100,
  },
  output: {
    rawArticulationLossPercent: 800,
    cappedArticulationLossPercent: 100,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      directivityFactor: input.directivityFactor as number,
      distanceMeters: input.distanceMeters as number,
      reverberationTimeSeconds: input.reverberationTimeSeconds as number,
      roomVolumeCubicMeters: input.roomVolumeCubicMeters as number,
    }),
  description:
    "Apply the simplified Peutz far-field estimate 200 r² T60²/(VQ), preserving the uncapped result and a 100-percent display cap.",
  id: "acoustics/peutz-alcons-estimate",
  inputs: [
    {
      id: "directivityFactor",
      kind: "number",
      label: "Source directivity factor",
      minimum: 0,
    },
    {
      id: "distanceMeters",
      kind: "number",
      label: "Source-receiver distance",
      minimum: 0,
      unit: "m",
    },
    {
      id: "reverberationTimeSeconds",
      kind: "number",
      label: "Reverberation time",
      minimum: 0,
      unit: "s",
    },
    {
      id: "roomVolumeCubicMeters",
      kind: "number",
      label: "Room volume",
      minimum: 0,
      unit: "m³",
    },
  ],
  outputs: [
    {
      id: "rawArticulationLossPercent",
      kind: "number",
      label: "Raw articulation-loss estimate",
      minimum: 0,
      unit: "%",
    },
    {
      id: "cappedArticulationLossPercent",
      kind: "number",
      label: "Capped articulation-loss estimate",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Peutz ALcons Estimate",
});

export const run = tool.execute;
export default tool;
