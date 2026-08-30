import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly gainEvents: number;
  readonly lossEvents: number;
  readonly assayedSites: number;
  readonly generations: number;
}>;
export type Output = Readonly<{
  readonly totalEpimutations: number;
  readonly ratePerSiteGeneration: number;
}>;

export const calculate = (input: Input): Output => {
  const totalEpimutations = input.gainEvents + input.lossEvents;
  return {
    totalEpimutations,
    ratePerSiteGeneration:
      totalEpimutations / (input.assayedSites * input.generations),
  };
};

export const exampleInput = {
  gainEvents: 30,
  lossEvents: 20,
  assayedSites: 1000,
  generations: 5,
} satisfies Input;
export const exampleOutput = {
  totalEpimutations: 50,
  ratePerSiteGeneration: 0.01,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      gainEvents: input.gainEvents as number,
      lossEvents: input.lossEvents as number,
      assayedSites: input.assayedSites as number,
      generations: input.generations as number,
    }),
  description: "Estimate epimutation rate per site and generation.",
  id: "epigenetics/epimutation-rate",
  inputs: [
    {
      id: "gainEvents",
      label: "Methylation gains",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "lossEvents",
      label: "Methylation losses",
      kind: "integer",
      minimum: 0,
    },
    { id: "assayedSites", label: "Assayed sites", kind: "integer", minimum: 1 },
    { id: "generations", label: "Generations", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "totalEpimutations",
      label: "Total epimutations",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "ratePerSiteGeneration",
      label: "Rate per site-generation",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Epimutation Rate",
});

export const run = tool.execute;
export default tool;
