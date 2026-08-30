import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteCreepCoefficientInput = Readonly<{
  readonly creepStrain: number;
  readonly elasticStrain: number;
}>;
export type ConcreteCreepCoefficientOutput = Readonly<{
  readonly creepCoefficient: number;
}>;

export const calculateConcreteCreepCoefficient = (
  x: ConcreteCreepCoefficientInput,
): ConcreteCreepCoefficientOutput => {
  if (!Number.isFinite(x.creepStrain) || x.creepStrain < 0)
    simpleError("creepStrain", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.elasticStrain) || x.elasticStrain < 0)
    simpleError("elasticStrain", "Provide a finite number at least 0.");
  const creepCoefficient = x.creepStrain / x.elasticStrain;
  if (!Number.isFinite(creepCoefficient))
    simpleError(
      "creepCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    creepCoefficient: Object.is(creepCoefficient, -0) ? 0 : creepCoefficient,
  };
};

export const example = {
  input: { creepStrain: 0.001, elasticStrain: 0.0005 },
  output: { creepCoefficient: 2 },
} satisfies ToolExample<
  ConcreteCreepCoefficientInput,
  ConcreteCreepCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "engineering/concrete-creep-coefficient",
  title: "Concrete Creep Coefficient",
  description:
    "Measured concrete creep coefficient as creep strain divided by instantaneous elastic strain under sustained loading.",
  inputs: [
    { id: "creepStrain", kind: "number", label: "Creep Strain", minimum: 0 },
    {
      id: "elasticStrain",
      kind: "number",
      label: "Elastic Strain",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "creepCoefficient", kind: "number", label: "Creep Coefficient" },
  ],
  calculate: (input) =>
    calculateConcreteCreepCoefficient({
      creepStrain: input.creepStrain as number,
      elasticStrain: input.elasticStrain as number,
    }),
});
export const concreteCreepCoefficientTool = tool;
export const runConcreteCreepCoefficient = tool.execute;
export default tool;
