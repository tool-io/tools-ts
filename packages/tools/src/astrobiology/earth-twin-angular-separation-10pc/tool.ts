import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly projectedOrbitalSeparationAu: number;
  readonly stellarDistanceParsecs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "projectedOrbitalSeparationAu",
    label: "Projected orbital separation au",
    kind: "number",
  },
  {
    id: "stellarDistanceParsecs",
    label: "Stellar distance parsecs",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.projectedOrbitalSeparationAu, "projectedseparation");
  positive(input.stellarDistanceParsecs, "distance");
  return {
    conditionalAngularSeparationMilliarcseconds:
      (1000 * input.projectedOrbitalSeparationAu) /
      input.stellarDistanceParsecs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { projectedOrbitalSeparationAu: 1, stellarDistanceParsecs: 10 },
  output: { result: { conditionalAngularSeparationMilliarcseconds: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/earth-twin-angular-separation-10pc",
  title: "Earth Twin Angular Separation milliarcseconds at 10 pc Calculator",
  description:
    "Ideal small-angle projected AU/pcseparation in milliarcseconds; Earth-twin at1projected AU and 10 pc gives 100 mas. Inclination, phase, eccentricity and coronagraph sensitivity not inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
