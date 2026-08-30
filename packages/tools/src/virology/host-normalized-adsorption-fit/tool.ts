import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly initialFreeTiter: number;
  readonly finalFreeTiter: number;
  readonly elapsedHours: number;
  readonly hostCellsPerMl: number;
}>;
export type Output = Readonly<{
  readonly adsorptionConstantMlPerCellHour: number;
  readonly freeVirusLossFraction: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.initialFreeTiter, "initialFreeTiter");
  positive(input.finalFreeTiter, "finalFreeTiter");
  positive(input.elapsedHours, "elapsedHours");
  positive(input.hostCellsPerMl, "hostCellsPerMl");
  if (input.finalFreeTiter > input.initialFreeTiter)
    simpleError(
      "finalFreeTiter",
      "Free-virus titer must not increase in this adsorption-only model.",
    );
  return {
    adsorptionConstantMlPerCellHour:
      (Math.log(input.initialFreeTiter) - Math.log(input.finalFreeTiter)) /
      (input.elapsedHours * input.hostCellsPerMl),
    freeVirusLossFraction: 1 - input.finalFreeTiter / input.initialFreeTiter,
  };
};
export const exampleInput = {
  initialFreeTiter: 100,
  finalFreeTiter: 50,
  elapsedHours: 1,
  hostCellsPerMl: 1000000,
} satisfies Input;
export const exampleOutput = {
  adsorptionConstantMlPerCellHour: 6.931471805599452e-7,
  freeVirusLossFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/host-normalized-adsorption-fit",
  title: "Host Normalized Adsorption Fit",
  description:
    "Fit a host-density-normalized adsorption constant from free-virus decay, assuming negligible replication and independent loss.",
  inputs: [
    { id: "initialFreeTiter", label: "Initial free titer", kind: "number" },
    { id: "finalFreeTiter", label: "Final free titer", kind: "number" },
    { id: "elapsedHours", label: "Elapsed hours", kind: "number" },
    { id: "hostCellsPerMl", label: "Host cells per ml", kind: "number" },
  ],
  outputs: [
    {
      id: "adsorptionConstantMlPerCellHour",
      label: "Adsorption constant ml per cell hour",
      kind: "number",
    },
    {
      id: "freeVirusLossFraction",
      label: "Free virus loss fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialFreeTiter: value.initialFreeTiter as number,
      finalFreeTiter: value.finalFreeTiter as number,
      elapsedHours: value.elapsedHours as number,
      hostCellsPerMl: value.hostCellsPerMl as number,
    }),
});
export const run = tool.execute;
export default tool;
