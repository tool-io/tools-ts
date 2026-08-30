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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly appliedNormalLoadsN: readonly number[];
  readonly bareContactAreasM2: readonly number[];
  readonly effectiveMatLoadSpreadAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly bareGroundPressuresPa: readonly number[];
  readonly matModelGroundPressuresPa: readonly number[];
  readonly pressureReductionFactors: readonly number[];
  readonly pooledPressureReductionFactor: number;
}>;
const inputFields = [
  {
    id: "appliedNormalLoadsN",
    label: "Applied normal loads n",
    kind: "numberList",
  },
  {
    id: "bareContactAreasM2",
    label: "Bare contact areas m2",
    kind: "numberList",
  },
  {
    id: "effectiveMatLoadSpreadAreasM2",
    label: "Effective mat load spread areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.bareContactAreasM2.forEach((v) => positive(v, "bareContactAreasM2"));
  input.effectiveMatLoadSpreadAreasM2.forEach((v) =>
    positive(v, "effectiveMatLoadSpreadAreasM2"),
  );
  input.appliedNormalLoadsN.forEach((v) =>
    nonnegative(v, "appliedNormalLoadsN"),
  );
  aligned(
    input.appliedNormalLoadsN,
    input.bareContactAreasM2,
    "appliedNormalLoadsN",
  );
  aligned(
    input.appliedNormalLoadsN,
    input.effectiveMatLoadSpreadAreasM2,
    "appliedNormalLoadsN",
  );
  if (
    input.effectiveMatLoadSpreadAreasM2.some(
      (v, i) => v < input.bareContactAreasM2[i],
    )
  )
    simpleError(
      "matAreas",
      "A reduction model requires effective mat areas at least bare contact areas.",
    );
  positive(
    input.appliedNormalLoadsN.reduce((a, b) => a + b, 0),
    "loads",
  );
  return {
    bareGroundPressuresPa: input.appliedNormalLoadsN.map(
      (v, i) => v / input.bareContactAreasM2[i],
    ),
    matModelGroundPressuresPa: input.appliedNormalLoadsN.map(
      (v, i) => v / input.effectiveMatLoadSpreadAreasM2[i],
    ),
    pressureReductionFactors: input.bareContactAreasM2.map(
      (v, i) => input.effectiveMatLoadSpreadAreasM2[i] / v,
    ),
    pooledPressureReductionFactor:
      input.effectiveMatLoadSpreadAreasM2.reduce((a, b) => a + b, 0) /
      input.bareContactAreasM2.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  appliedNormalLoadsN: [100, 200],
  bareContactAreasM2: [1, 1],
  effectiveMatLoadSpreadAreasM2: [2, 4],
} satisfies Input;
export const exampleOutput = {
  bareGroundPressuresPa: [100, 200],
  matModelGroundPressuresPa: [50, 50],
  pressureReductionFactors: [2, 4],
  pooledPressureReductionFactor: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/brash-mat-ground-pressure-reduction-factor",
  title: "Brash Mat Ground Pressure Reduction Factor",
  description:
    "Compare declared normal-load pressure under bare versus independently supplied effective brash-mat spread areas; ideal uniform pressure model excludes mat stiffness, failure and safe trafficability.",
  inputs: inputFields,
  outputs: [
    {
      id: "bareGroundPressuresPa",
      label: "Bare ground pressures pa",
      kind: "numberList",
    },
    {
      id: "matModelGroundPressuresPa",
      label: "Mat model ground pressures pa",
      kind: "numberList",
    },
    {
      id: "pressureReductionFactors",
      label: "Pressure reduction factors",
      kind: "numberList",
    },
    {
      id: "pooledPressureReductionFactor",
      label: "Pooled pressure reduction factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      appliedNormalLoadsN: value.appliedNormalLoadsN as readonly number[],
      bareContactAreasM2: value.bareContactAreasM2 as readonly number[],
      effectiveMatLoadSpreadAreasM2:
        value.effectiveMatLoadSpreadAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
