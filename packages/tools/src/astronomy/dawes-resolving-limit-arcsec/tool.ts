import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{ readonly apertureDiameterMm: number }>;
export type Output = Readonly<{ readonly empiricalDawesArcsec: number }>;
const inputFields = [
  { id: "apertureDiameterMm", label: "Aperture diameter mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.apertureDiameterMm, "apertureDiameterMm");
  return { empiricalDawesArcsec: 116 / input.apertureDiameterMm };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { apertureDiameterMm: 100 } satisfies Input;
export const exampleOutput = { empiricalDawesArcsec: 1.16 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/dawes-resolving-limit-arcsec",
  title: "Dawes Resolving Limit Arcsec",
  description:
    "Named empirical Dawes 116/Dmmclose equal-brightness visual binary criterion, not Rayleigh wavelength/diffraction or seeing resolution. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "empiricalDawesArcsec",
      label: "Empirical dawes arcsec",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ apertureDiameterMm: value.apertureDiameterMm as number }),
});
export const run = tool.execute;
export default tool;
