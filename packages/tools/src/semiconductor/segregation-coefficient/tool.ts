import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SegregationCoefficientInput = Readonly<{
  readonly solidConcentrationPerM3: number;
  readonly liquidConcentrationPerM3: number;
}>;
export type SegregationCoefficientOutput = Readonly<{
  readonly segregationCoefficient: number;
}>;

export const calculateSegregationCoefficient = (
  x: SegregationCoefficientInput,
): SegregationCoefficientOutput => {
  if (
    !Number.isFinite(x.solidConcentrationPerM3) ||
    x.solidConcentrationPerM3 < 0
  )
    simpleError(
      "solidConcentrationPerM3",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.liquidConcentrationPerM3) ||
    x.liquidConcentrationPerM3 < 0
  )
    simpleError(
      "liquidConcentrationPerM3",
      "Provide a finite number at least 0.",
    );
  const segregationCoefficient =
    x.solidConcentrationPerM3 / x.liquidConcentrationPerM3;
  if (!Number.isFinite(segregationCoefficient))
    simpleError(
      "segregationCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    segregationCoefficient: Object.is(segregationCoefficient, -0)
      ? 0
      : segregationCoefficient,
  };
};

export const example = {
  input: {
    solidConcentrationPerM3: 200000000000000000000,
    liquidConcentrationPerM3: 1e21,
  },
  output: { segregationCoefficient: 0.2 },
} satisfies ToolExample<
  SegregationCoefficientInput,
  SegregationCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/segregation-coefficient",
  title: "Segregation Coefficient",
  description:
    "Equilibrium dopant segregation coefficient at a solid–liquid interface from solid and adjacent liquid concentrations.",
  inputs: [
    {
      id: "solidConcentrationPerM3",
      kind: "number",
      label: "Solid Concentration Per M3",
      unit: "m⁻³",
      minimum: 0,
    },
    {
      id: "liquidConcentrationPerM3",
      kind: "number",
      label: "Liquid Concentration Per M3",
      unit: "m⁻³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "segregationCoefficient",
      kind: "number",
      label: "Segregation Coefficient",
    },
  ],
  calculate: (input) =>
    calculateSegregationCoefficient({
      solidConcentrationPerM3: input.solidConcentrationPerM3 as number,
      liquidConcentrationPerM3: input.liquidConcentrationPerM3 as number,
    }),
});
export const segregationCoefficientTool = tool;
export const runSegregationCoefficient = tool.execute;
export default tool;
