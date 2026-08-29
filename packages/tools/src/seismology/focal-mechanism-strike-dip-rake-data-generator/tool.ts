import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const focalMechanismStrikeDipRakeDataGeneratorExample = {
  input: { strikeDeg: 40, sampleCount: 4, seed: 42 },
  output: {
    azimuthsDeg: [
      31.725016348063946, 80.11953575536609, 90.84426292218268,
      207.8212313633412,
    ],
    polaritySigns: [-1, 1, 1, -1],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const focalMechanismStrikeDipRakeDataGeneratorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ strikeDeg, sampleCount, seed }) => {
      let s = seed >>> 0;
      const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
      const az: number[] = [];
      for (let i = 0; i < sampleCount; i++) az.push(rand() * 360);
      az.sort((a, b) => a - b);
      const pol = az.map((a) =>
        Math.sin((2 * (a - strikeDeg) * Math.PI) / 180) >= 0 ? 1 : -1,
      );
      return { azimuthsDeg: az, polaritySigns: pol };
    })(input as never) as Record<string, unknown>,
  description:
    "Generate synthetic P-wave polarity training data for a strike-slip-dominant focal mechanism.",
  id: "seismology/focal-mechanism-strike-dip-rake-data-generator",
  inputs: [
    {
      minimum: 0,
      description: "Strike of the fault.",
      id: "strikeDeg",
      kind: "number",
      label: "φ",
      unit: "°",
    },
    {
      minimum: 1,
      maximum: 10000,
      description: "Number of synthetic stations.",
      id: "sampleCount",
      kind: "integer",
      label: "N",
    },
    {
      minimum: 0,
      description: "Deterministic RNG seed.",
      id: "seed",
      kind: "integer",
      label: "seed",
    },
  ],
  outputs: [
    {
      description: "Station azimuths (ascending).",
      id: "azimuthsDeg",
      kind: "numberList",
      label: "az",
    },
    {
      description: "Radiation-pattern sign per azimuth (1 up, -1 down).",
      id: "polaritySigns",
      kind: "numberList",
      label: "pol",
    },
  ],
  title: "Synthetic Strike-Slip Polarity Data Generator",
});
export const runFocalMechanismStrikeDipRakeDataGenerator =
  focalMechanismStrikeDipRakeDataGeneratorTool.execute;
export { focalMechanismStrikeDipRakeDataGeneratorExample as example };
export default focalMechanismStrikeDipRakeDataGeneratorTool;
