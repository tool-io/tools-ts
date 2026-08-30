import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly zoneDiameterMm: number;
  readonly resistantMaximumMm: number;
  readonly susceptibleMinimumMm: number;
}>;
export type Output = Readonly<{
  readonly category: string;
  readonly distanceToSusceptibleBoundaryMm: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.zoneDiameterMm, "zoneDiameterMm");
  nonnegative(input.resistantMaximumMm, "resistantMaximumMm");
  if (input.susceptibleMinimumMm <= input.resistantMaximumMm)
    simpleError(
      "susceptibleMinimumMm",
      "Distinct ordered current organism/drug/method breakpoints required.",
    );
  return {
    category:
      input.zoneDiameterMm <= input.resistantMaximumMm
        ? "R"
        : input.zoneDiameterMm >= input.susceptibleMinimumMm
          ? "S"
          : "I",
    distanceToSusceptibleBoundaryMm:
      input.zoneDiameterMm - input.susceptibleMinimumMm,
  };
};
export const exampleInput = {
  zoneDiameterMm: 15,
  resistantMaximumMm: 10,
  susceptibleMinimumMm: 20,
} satisfies Input;
export const exampleOutput = {
  category: "I",
  distanceToSusceptibleBoundaryMm: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/supplied-disk-zone-interpretation",
  title: "Supplied Disk Zone Interpretation",
  description:
    "Apply caller-supplied disk-diffusion zone breakpoints; I retains the supplied classification scheme and is not universally interpreted as intermediate.",
  inputs: [
    {
      id: "zoneDiameterMm",
      label: "Zone diameter mm",
      kind: "number",
      minimum: 0,
    },
    {
      id: "resistantMaximumMm",
      label: "Resistant maximum mm",
      kind: "number",
      minimum: 0,
    },
    {
      id: "susceptibleMinimumMm",
      label: "Susceptible minimum mm",
      kind: "number",
    },
  ],
  outputs: [
    { id: "category", label: "Category", kind: "string" },
    {
      id: "distanceToSusceptibleBoundaryMm",
      label: "Distance to susceptible boundary mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      zoneDiameterMm: value.zoneDiameterMm as number,
      resistantMaximumMm: value.resistantMaximumMm as number,
      susceptibleMinimumMm: value.susceptibleMinimumMm as number,
    }),
});
export const run = tool.execute;
export default tool;
