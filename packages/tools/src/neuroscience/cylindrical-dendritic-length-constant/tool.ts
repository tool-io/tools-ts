import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly diameterMicrometers: number;
  readonly specificMembraneResistanceOhmCm2: number;
  readonly axialResistivityOhmCm: number;
}>;
export type Output = Readonly<{
  readonly lengthConstantMicrometers: number;
}>;
const inputFields = [
  { id: "diameterMicrometers", label: "Diameter micrometers", kind: "number" },
  {
    id: "specificMembraneResistanceOhmCm2",
    label: "Specific membrane resistance ohm cm2",
    kind: "number",
  },
  {
    id: "axialResistivityOhmCm",
    label: "Axial resistivity ohm cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.diameterMicrometers, "diameterMicrometers");
  positive(
    input.specificMembraneResistanceOhmCm2,
    "specificMembraneResistanceOhmCm2",
  );
  positive(input.axialResistivityOhmCm, "axialResistivityOhmCm");
  return {
    lengthConstantMicrometers:
      10000 *
      Math.sqrt(
        (input.diameterMicrometers *
          1e-4 *
          input.specificMembraneResistanceOhmCm2) /
          (4 * input.axialResistivityOhmCm),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  diameterMicrometers: 4,
  specificMembraneResistanceOhmCm2: 10000,
  axialResistivityOhmCm: 100,
} satisfies Input;
export const exampleOutput = {
  lengthConstantMicrometers: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/cylindrical-dendritic-length-constant",
  title: "Dendritic Length Constant",
  description:
    "Evaluate the passive cylindrical cable length constant sqrt(d·Rm/(4·Ri)) with explicit micrometre/ohm-centimetre conversion; branching and active conductances are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "lengthConstantMicrometers",
      label: "Length constant micrometers",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      diameterMicrometers: value.diameterMicrometers as number,
      specificMembraneResistanceOhmCm2:
        value.specificMembraneResistanceOhmCm2 as number,
      axialResistivityOhmCm: value.axialResistivityOhmCm as number,
    }),
});
export const run = tool.execute;
export default tool;
