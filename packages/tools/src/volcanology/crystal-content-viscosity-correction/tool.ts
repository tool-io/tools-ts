import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly meltViscosityPaSeconds: number;
  readonly crystalVolumeFraction: number;
  readonly maximumPackingFraction: number;
  readonly intrinsicViscosity: number;
}>;
export type Output = Readonly<{
  readonly relativeViscosityMultiplier: number;
  readonly effectiveViscosityPaSeconds: number;
}>;
const inputFields = [
  {
    id: "meltViscosityPaSeconds",
    label: "Melt viscosity pa seconds",
    kind: "number",
  },
  {
    id: "crystalVolumeFraction",
    label: "Crystal volume fraction",
    kind: "number",
  },
  {
    id: "maximumPackingFraction",
    label: "Maximum packing fraction",
    kind: "number",
  },
  { id: "intrinsicViscosity", label: "Intrinsic viscosity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.meltViscosityPaSeconds, "meltViscosityPaSeconds");
  positive(input.maximumPackingFraction, "maximumPackingFraction");
  positive(input.intrinsicViscosity, "intrinsicViscosity");
  fraction(input.crystalVolumeFraction, "crystalVolumeFraction");
  fraction(input.maximumPackingFraction, "maximumPackingFraction");
  if (input.crystalVolumeFraction >= input.maximumPackingFraction)
    simpleError(
      "crystalVolumeFraction",
      "Crystal fraction must be strictly below calibrated packing limit.",
    );
  const relativeViscosityMultiplier = Math.exp(
    -input.intrinsicViscosity *
      input.maximumPackingFraction *
      Math.log1p(-input.crystalVolumeFraction / input.maximumPackingFraction),
  );
  return {
    relativeViscosityMultiplier,
    effectiveViscosityPaSeconds:
      input.meltViscosityPaSeconds * relativeViscosityMultiplier,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  meltViscosityPaSeconds: 100,
  crystalVolumeFraction: 0.2,
  maximumPackingFraction: 0.4,
  intrinsicViscosity: 2.5,
} satisfies Input;
export const exampleOutput = {
  relativeViscosityMultiplier: 2,
  effectiveViscosityPaSeconds: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/crystal-content-viscosity-correction",
  title: "Crystal Content Viscosity Correction",
  description:
    "Apply caller Krieger–Dougherty suspension correction below packing to independently supplied melt viscosity; distinct from existing Arrhenius melt-viscosity calculation, not a yield-stress or crystal-shape universal model.",
  inputs: inputFields,
  outputs: [
    {
      id: "relativeViscosityMultiplier",
      label: "Relative viscosity multiplier",
      kind: "number",
    },
    {
      id: "effectiveViscosityPaSeconds",
      label: "Effective viscosity pa seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      meltViscosityPaSeconds: value.meltViscosityPaSeconds as number,
      crystalVolumeFraction: value.crystalVolumeFraction as number,
      maximumPackingFraction: value.maximumPackingFraction as number,
      intrinsicViscosity: value.intrinsicViscosity as number,
    }),
});
export const run = tool.execute;
export default tool;
