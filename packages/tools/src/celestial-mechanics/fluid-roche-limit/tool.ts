import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly primaryRadius: number;
  readonly primaryDensity: number;
  readonly satelliteDensity: number;
  readonly fluidCoefficient: number;
}>;
export type Output = Readonly<{
  readonly rocheDistance: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.primaryRadius, "primaryRadius");
  positive(input.primaryDensity, "primaryDensity");
  positive(input.satelliteDensity, "satelliteDensity");
  positive(input.fluidCoefficient, "fluidCoefficient");
  return {
    rocheDistance:
      input.fluidCoefficient *
      input.primaryRadius *
      Math.cbrt(input.primaryDensity / input.satelliteDensity),
  };
};
export const exampleInput = {
  primaryRadius: 10,
  primaryDensity: 8,
  satelliteDensity: 1,
  fluidCoefficient: 2.44,
} satisfies Input;
export const exampleOutput = { rocheDistance: 48.8 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/fluid-roche-limit",
  title: "Fluid Roche Limit",
  description:
    "Estimate a fluid Roche limit from caller densities and structural coefficient; rigid and strength-supported bodies require different models.",
  inputs: [
    { id: "primaryRadius", label: "Primary radius", kind: "number" },
    { id: "primaryDensity", label: "Primary density", kind: "number" },
    { id: "satelliteDensity", label: "Satellite density", kind: "number" },
    { id: "fluidCoefficient", label: "Fluid coefficient", kind: "number" },
  ],
  outputs: [{ id: "rocheDistance", label: "Roche distance", kind: "number" }],
  calculate: (value) =>
    calculate({
      primaryRadius: value.primaryRadius as number,
      primaryDensity: value.primaryDensity as number,
      satelliteDensity: value.satelliteDensity as number,
      fluidCoefficient: value.fluidCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
