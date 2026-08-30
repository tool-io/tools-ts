import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly adsorptionCompleteHour: number;
  readonly firstIntracellularInfectiousHour: number;
  readonly firstExtracellularProgenyHour: number;
}>;
export type Output = Readonly<{
  readonly eclipseHours: number;
  readonly latentHours: number;
  readonly releaseDelayHours: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.adsorptionCompleteHour, "adsorptionCompleteHour");
  if (
    input.firstIntracellularInfectiousHour < input.adsorptionCompleteHour ||
    input.firstExtracellularProgenyHour < input.firstIntracellularInfectiousHour
  )
    simpleError(
      "firstIntracellularInfectiousHour",
      "Adsorption, intracellular detection and extracellular release must be chronologically ordered.",
    );
  return {
    eclipseHours:
      input.firstIntracellularInfectiousHour - input.adsorptionCompleteHour,
    latentHours:
      input.firstExtracellularProgenyHour - input.adsorptionCompleteHour,
    releaseDelayHours:
      input.firstExtracellularProgenyHour -
      input.firstIntracellularInfectiousHour,
  };
};
export const exampleInput = {
  adsorptionCompleteHour: 0,
  firstIntracellularInfectiousHour: 2,
  firstExtracellularProgenyHour: 3,
} satisfies Input;
export const exampleOutput = {
  eclipseHours: 2,
  latentHours: 3,
  releaseDelayHours: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/eclipse-latent-period-timeline",
  title: "Eclipse Latent Period Timeline",
  description:
    "Separate observed eclipse, latent, and release-delay intervals from a one-step infection timeline.",
  inputs: [
    {
      id: "adsorptionCompleteHour",
      label: "Adsorption complete hour",
      kind: "number",
      minimum: 0,
    },
    {
      id: "firstIntracellularInfectiousHour",
      label: "First intracellular infectious hour",
      kind: "number",
    },
    {
      id: "firstExtracellularProgenyHour",
      label: "First extracellular progeny hour",
      kind: "number",
    },
  ],
  outputs: [
    { id: "eclipseHours", label: "Eclipse hours", kind: "number" },
    { id: "latentHours", label: "Latent hours", kind: "number" },
    { id: "releaseDelayHours", label: "Release delay hours", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      adsorptionCompleteHour: value.adsorptionCompleteHour as number,
      firstIntracellularInfectiousHour:
        value.firstIntracellularInfectiousHour as number,
      firstExtracellularProgenyHour:
        value.firstExtracellularProgenyHour as number,
    }),
});
export const run = tool.execute;
export default tool;
