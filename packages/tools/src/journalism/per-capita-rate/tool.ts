import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly eventCount: number;
  readonly population: number;
  readonly scale: number;
}>;
export type Output = Readonly<{
  readonly perCapitaRate: number;
  readonly oneEventPerPeople: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.population <= 0 || input.scale <= 0 || input.eventCount <= 0)
    simpleError(
      "population",
      "Population, scale, and event count must be positive.",
      "invalid_rate",
    );
  return {
    perCapitaRate: (input.eventCount / input.population) * input.scale,
    oneEventPerPeople: input.population / input.eventCount,
  };
};

export const exampleInput = {
  eventCount: 50,
  population: 10000,
  scale: 100000,
} satisfies Input;
export const exampleOutput = {
  perCapitaRate: 500,
  oneEventPerPeople: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      eventCount: input.eventCount as number,
      population: input.population as number,
      scale: input.scale as number,
    }),
  description: "Calculate a scaled per-capita rate and people-per-event ratio.",
  id: "journalism/per-capita-rate",
  inputs: [
    { id: "eventCount", label: "Event count", kind: "number", minimum: 0 },
    {
      id: "population",
      label: "Population denominator",
      kind: "number",
      minimum: 0,
    },
    { id: "scale", label: "Per-capita scale", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "perCapitaRate",
      label: "Per-capita rate",
      kind: "number",
      minimum: 0,
    },
    {
      id: "oneEventPerPeople",
      label: "People per event",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Per-Capita Rate",
});

export const run = tool.execute;
export default tool;
