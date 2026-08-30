import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly openGrownCrownDiametersM: readonly number[];
  readonly representedStemsPerHa: readonly number[];
}>;
export type Output = Readonly<{
  readonly potentialOpenGrownCrownAreaM2PerHa: number;
  readonly crownCompetitionFactorPercent: number;
}>;
const inputFields = [
  {
    id: "openGrownCrownDiametersM",
    label: "Open grown crown diameters m",
    kind: "numberList",
  },
  {
    id: "representedStemsPerHa",
    label: "Represented stems per ha",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.openGrownCrownDiametersM.forEach((v) =>
    nonnegative(v, "openGrownCrownDiametersM"),
  );
  input.representedStemsPerHa.forEach((v) =>
    nonnegative(v, "representedStemsPerHa"),
  );
  aligned(
    input.openGrownCrownDiametersM,
    input.representedStemsPerHa,
    "openGrownCrownDiametersM",
  );
  const potentialOpenGrownCrownAreaM2PerHa =
    input.openGrownCrownDiametersM.reduce(
      (s, d, i) => s + ((Math.PI * d * d) / 4) * input.representedStemsPerHa[i],
      0,
    );
  return {
    potentialOpenGrownCrownAreaM2PerHa,
    crownCompetitionFactorPercent: potentialOpenGrownCrownAreaM2PerHa / 100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openGrownCrownDiametersM: [2, 4],
  representedStemsPerHa: [100, 50],
} satisfies Input;
export const exampleOutput = {
  potentialOpenGrownCrownAreaM2PerHa: 942.4777960769379,
  crownCompetitionFactorPercent: 9.42477796076938,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/crown-competition-factor-forestry",
  title: "Crown Competition Factor",
  description:
    "Sum caller open-grown potential crown areas under represented stem densities, allowing CCF above 100%; unlike measured canopy union cover, crowns may overlap and widths require independent calibration.",
  inputs: inputFields,
  outputs: [
    {
      id: "potentialOpenGrownCrownAreaM2PerHa",
      label: "Potential open grown crown area m2 per ha",
      kind: "number",
    },
    {
      id: "crownCompetitionFactorPercent",
      label: "Crown competition factor percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      openGrownCrownDiametersM:
        value.openGrownCrownDiametersM as readonly number[],
      representedStemsPerHa: value.representedStemsPerHa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
