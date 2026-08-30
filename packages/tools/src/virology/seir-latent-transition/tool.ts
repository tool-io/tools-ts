import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly exposedPopulation: number;
  readonly latentPeriodDays: number;
  readonly stepDays: number;
}>;
export type Output = Readonly<{
  readonly latentExitRatePerDay: number;
  readonly expectedLatentExits: number;
  readonly remainingExposed: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.exposedPopulation, "exposedPopulation");
  positive(input.latentPeriodDays, "latentPeriodDays");
  nonnegative(input.stepDays, "stepDays");
  const latentExitRatePerDay = 1 / input.latentPeriodDays,
    remainingExposed =
      input.exposedPopulation *
      Math.exp(-input.stepDays * latentExitRatePerDay);
  return {
    latentExitRatePerDay,
    expectedLatentExits: input.exposedPopulation - remainingExposed,
    remainingExposed,
  };
};
export const exampleInput = {
  exposedPopulation: 100,
  latentPeriodDays: 5,
  stepDays: 1,
} satisfies Input;
export const exampleOutput = {
  latentExitRatePerDay: 0.2,
  expectedLatentExits: 18.12692469220182,
  remainingExposed: 81.87307530779819,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/seir-latent-transition",
  title: "SEIR Latent Transition",
  description:
    "Project exits from the SEIR exposed compartment under exponentially distributed latency with no new arrivals.",
  inputs: [
    {
      id: "exposedPopulation",
      label: "Exposed population",
      kind: "number",
      minimum: 0,
    },
    { id: "latentPeriodDays", label: "Latent period days", kind: "number" },
    { id: "stepDays", label: "Step days", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "latentExitRatePerDay",
      label: "Latent exit rate per day",
      kind: "number",
    },
    {
      id: "expectedLatentExits",
      label: "Expected latent exits",
      kind: "number",
    },
    { id: "remainingExposed", label: "Remaining exposed", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      exposedPopulation: value.exposedPopulation as number,
      latentPeriodDays: value.latentPeriodDays as number,
      stepDays: value.stepDays as number,
    }),
});
export const run = tool.execute;
export default tool;
