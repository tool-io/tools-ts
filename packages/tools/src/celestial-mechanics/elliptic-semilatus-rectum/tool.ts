import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, eccentricity } from "../shared.js";

export type Input = Readonly<{
  readonly semimajorAxis: number;
  readonly orbitalEccentricity: number;
}>;
export type Output = Readonly<{
  readonly semilatusRectum: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.semimajorAxis, "semimajorAxis");
  eccentricity(input.orbitalEccentricity);
  return {
    semilatusRectum: input.semimajorAxis * (1 - input.orbitalEccentricity ** 2),
  };
};
export const exampleInput = {
  semimajorAxis: 2,
  orbitalEccentricity: 0.5,
} satisfies Input;
export const exampleOutput = { semilatusRectum: 1.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/elliptic-semilatus-rectum",
  title: "Elliptic Semilatus Rectum",
  description:
    "Calculate the elliptic semilatus rectum from semimajor axis and eccentricity rather than measured apsis radii.",
  inputs: [
    { id: "semimajorAxis", label: "Semimajor axis", kind: "number" },
    {
      id: "orbitalEccentricity",
      label: "Orbital eccentricity",
      kind: "number",
    },
  ],
  outputs: [
    { id: "semilatusRectum", label: "Semilatus rectum", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      semimajorAxis: value.semimajorAxis as number,
      orbitalEccentricity: value.orbitalEccentricity as number,
    }),
});
export const run = tool.execute;
export default tool;
