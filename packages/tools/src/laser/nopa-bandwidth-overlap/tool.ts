import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly seedCenterNanometers: number;
  readonly seedBandwidthNanometers: number;
  readonly gainCenterNanometers: number;
  readonly gainBandwidthNanometers: number;
}>;
export type Output = Readonly<{
  readonly overlapBandwidthNanometers: number;
  readonly seedCoveragePercent: number;
}>;

export const calculate = (input: Input): Output => {
  const lower = Math.max(
    input.seedCenterNanometers - input.seedBandwidthNanometers / 2,
    input.gainCenterNanometers - input.gainBandwidthNanometers / 2,
  );
  const upper = Math.min(
    input.seedCenterNanometers + input.seedBandwidthNanometers / 2,
    input.gainCenterNanometers + input.gainBandwidthNanometers / 2,
  );
  const overlapBandwidthNanometers = Math.max(0, upper - lower);
  return {
    overlapBandwidthNanometers,
    seedCoveragePercent:
      input.seedBandwidthNanometers === 0
        ? 0
        : (overlapBandwidthNanometers / input.seedBandwidthNanometers) * 100,
  };
};

export const exampleInput = {
  seedCenterNanometers: 800,
  seedBandwidthNanometers: 100,
  gainCenterNanometers: 825,
  gainBandwidthNanometers: 100,
} satisfies Input;
export const exampleOutput = {
  overlapBandwidthNanometers: 75,
  seedCoveragePercent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      seedCenterNanometers: input.seedCenterNanometers as number,
      seedBandwidthNanometers: input.seedBandwidthNanometers as number,
      gainCenterNanometers: input.gainCenterNanometers as number,
      gainBandwidthNanometers: input.gainBandwidthNanometers as number,
    }),
  description:
    "Calculate spectral overlap between a NOPA seed and gain window.",
  id: "laser/nopa-bandwidth-overlap",
  inputs: [
    {
      id: "seedCenterNanometers",
      label: "Seed center wavelength",
      kind: "number",
      unit: "nm",
    },
    {
      id: "seedBandwidthNanometers",
      label: "Seed bandwidth",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "gainCenterNanometers",
      label: "NOPA gain center",
      kind: "number",
      unit: "nm",
    },
    {
      id: "gainBandwidthNanometers",
      label: "NOPA gain bandwidth",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "overlapBandwidthNanometers",
      label: "Seed/gain overlap bandwidth",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "seedCoveragePercent",
      label: "Seed bandwidth covered",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "NOPA Bandwidth Overlap",
});

export const run = tool.execute;
export default tool;
