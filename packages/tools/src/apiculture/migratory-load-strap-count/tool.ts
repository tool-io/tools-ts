import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly loadMassKg: number;
  readonly gravityMPerSecondSquared: number;
  readonly designAccelerationFractionG: number;
  readonly designFactor: number;
  readonly strapRatedForceKn: number;
  readonly capacityDeratingFraction: number;
  readonly strapAngleFromRestraintDegrees: number;
}>;
export type Output = Readonly<{
  readonly requiredRestraintForceKn: number;
  readonly effectiveForceKnPerStrap: number;
  readonly modelMinimumStrapCount: number;
}>;
const inputFields = [
  { id: "loadMassKg", label: "Load mass kg", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "designAccelerationFractionG",
    label: "Design acceleration fraction g",
    kind: "number",
  },
  { id: "designFactor", label: "Design factor", kind: "number" },
  { id: "strapRatedForceKn", label: "Strap rated force kn", kind: "number" },
  {
    id: "capacityDeratingFraction",
    label: "Capacity derating fraction",
    kind: "number",
  },
  {
    id: "strapAngleFromRestraintDegrees",
    label: "Strap angle from restraint degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.strapRatedForceKn, "strapRatedForceKn");
  positive(input.capacityDeratingFraction, "capacityDeratingFraction");
  nonnegative(input.loadMassKg, "loadMassKg");
  nonnegative(input.designAccelerationFractionG, "designAccelerationFractionG");
  fraction(input.capacityDeratingFraction, "capacityDeratingFraction");
  if (
    input.designFactor < 1 ||
    input.strapAngleFromRestraintDegrees < 0 ||
    input.strapAngleFromRestraintDegrees >= 90
  )
    simpleError(
      "designFactor",
      "Factor at least one and angle in [0,90) required.",
    );
  const requiredRestraintForceKn =
      (input.loadMassKg *
        input.gravityMPerSecondSquared *
        input.designAccelerationFractionG *
        input.designFactor) /
      1000,
    effectiveForceKnPerStrap =
      input.strapRatedForceKn *
      input.capacityDeratingFraction *
      Math.cos((input.strapAngleFromRestraintDegrees * Math.PI) / 180);
  return {
    requiredRestraintForceKn,
    effectiveForceKnPerStrap,
    modelMinimumStrapCount: count(
      Math.ceil(
        requiredRestraintForceKn /
          positive(effectiveForceKnPerStrap, "capacity"),
      ),
      "modelMinimumStrapCount",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  loadMassKg: 1000,
  gravityMPerSecondSquared: 10,
  designAccelerationFractionG: 0.5,
  designFactor: 2,
  strapRatedForceKn: 5,
  capacityDeratingFraction: 1,
  strapAngleFromRestraintDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  requiredRestraintForceKn: 10,
  effectiveForceKnPerStrap: 5,
  modelMinimumStrapCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/migratory-load-strap-count",
  title: "Migratory Load Strap Count",
  description:
    "Screen straight restraint-force strap count with supplied rated/derated capacity, angle and design acceleration; equal load sharing, anchorage and applicable transport rules require engineering review, not legal certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredRestraintForceKn",
      label: "Required restraint force kn",
      kind: "number",
    },
    {
      id: "effectiveForceKnPerStrap",
      label: "Effective force kn per strap",
      kind: "number",
    },
    {
      id: "modelMinimumStrapCount",
      label: "Model minimum strap count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      loadMassKg: value.loadMassKg as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      designAccelerationFractionG: value.designAccelerationFractionG as number,
      designFactor: value.designFactor as number,
      strapRatedForceKn: value.strapRatedForceKn as number,
      capacityDeratingFraction: value.capacityDeratingFraction as number,
      strapAngleFromRestraintDegrees:
        value.strapAngleFromRestraintDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
