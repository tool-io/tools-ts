import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { tisserand } from "../shared.js";

export type Input = Readonly<{
  readonly semimajorAxis: number;
  readonly eccentricity: number;
  readonly inclinationDegrees: number;
  readonly planetSemimajorAxis: number;
}>;
export type Output = Readonly<{
  readonly tisserandValue: number;
}>;
export const calculate = (input: Input): Output => {
  return {
    tisserandValue: tisserand(
      input.semimajorAxis,
      input.eccentricity,
      input.inclinationDegrees,
      input.planetSemimajorAxis,
    ),
  };
};
export const exampleInput = {
  semimajorAxis: 1,
  eccentricity: 0,
  inclinationDegrees: 0,
  planetSemimajorAxis: 1,
} satisfies Input;
export const exampleOutput = { tisserandValue: 3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/tisserand-orbital-parameter",
  title: "Tisserand Orbital Parameter",
  description:
    "Compute a circular restricted-three-body Tisserand parameter in the supplied planet frame; no universal comet taxonomy cutoff is embedded.",
  inputs: [
    { id: "semimajorAxis", label: "Semimajor axis", kind: "number" },
    { id: "eccentricity", label: "Eccentricity", kind: "number" },
    { id: "inclinationDegrees", label: "Inclination degrees", kind: "number" },
    {
      id: "planetSemimajorAxis",
      label: "Planet semimajor axis",
      kind: "number",
    },
  ],
  outputs: [{ id: "tisserandValue", label: "Tisserand value", kind: "number" }],
  calculate: (value) =>
    calculate({
      semimajorAxis: value.semimajorAxis as number,
      eccentricity: value.eccentricity as number,
      inclinationDegrees: value.inclinationDegrees as number,
      planetSemimajorAxis: value.planetSemimajorAxis as number,
    }),
});
export const run = tool.execute;
export default tool;
