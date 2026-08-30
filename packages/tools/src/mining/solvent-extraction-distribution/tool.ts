import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly organicEquilibriumConcentration: number;
  readonly aqueousEquilibriumConcentration: number;
  readonly organicVolumeLiters: number;
  readonly aqueousVolumeLiters: number;
}>;
export type Output = Readonly<{
  readonly distributionRatio: number;
  readonly organicMetalFraction: number;
}>;
const inputFields = [
  {
    id: "organicEquilibriumConcentration",
    label: "Organic equilibrium concentration",
    kind: "number",
  },
  {
    id: "aqueousEquilibriumConcentration",
    label: "Aqueous equilibrium concentration",
    kind: "number",
  },
  { id: "organicVolumeLiters", label: "Organic volume liters", kind: "number" },
  { id: "aqueousVolumeLiters", label: "Aqueous volume liters", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.aqueousEquilibriumConcentration,
    "aqueousEquilibriumConcentration",
  );
  positive(input.organicVolumeLiters, "organicVolumeLiters");
  positive(input.aqueousVolumeLiters, "aqueousVolumeLiters");
  nonnegative(
    input.organicEquilibriumConcentration,
    "organicEquilibriumConcentration",
  );
  const distributionRatio =
      input.organicEquilibriumConcentration /
      input.aqueousEquilibriumConcentration,
    ratio =
      (distributionRatio * input.organicVolumeLiters) /
      input.aqueousVolumeLiters;
  return { distributionRatio, organicMetalFraction: ratio / (1 + ratio) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  organicEquilibriumConcentration: 4,
  aqueousEquilibriumConcentration: 2,
  organicVolumeLiters: 1,
  aqueousVolumeLiters: 2,
} satisfies Input;
export const exampleOutput = {
  distributionRatio: 2,
  organicMetalFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/solvent-extraction-distribution",
  title: "Solvent Extraction Distribution",
  description:
    "Compute equilibrium distribution and phase metal fraction with explicit phase volumes and matched concentration units; speciation is external.",
  inputs: inputFields,
  outputs: [
    { id: "distributionRatio", label: "Distribution ratio", kind: "number" },
    {
      id: "organicMetalFraction",
      label: "Organic metal fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      organicEquilibriumConcentration:
        value.organicEquilibriumConcentration as number,
      aqueousEquilibriumConcentration:
        value.aqueousEquilibriumConcentration as number,
      organicVolumeLiters: value.organicVolumeLiters as number,
      aqueousVolumeLiters: value.aqueousVolumeLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
