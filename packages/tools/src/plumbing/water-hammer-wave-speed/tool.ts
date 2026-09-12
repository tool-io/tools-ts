import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerFluidBulkModulusPascals: number;
  readonly callerFluidDensityKgPerCubicMeter: number;
  readonly actualPipeInnerDiameterMeters: number;
  readonly callerIndependentPipeConstraintFactor: number;
  readonly callerPipeElasticModulusPascals: number;
  readonly actualWallThicknessMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerFluidBulkModulusPascals",
    label: "Caller fluid bulk modulus pascals",
    kind: "number",
  },
  {
    id: "callerFluidDensityKgPerCubicMeter",
    label: "Caller fluid density kg per cubic meter",
    kind: "number",
  },
  {
    id: "actualPipeInnerDiameterMeters",
    label: "Actual pipe inner diameter meters",
    kind: "number",
  },
  {
    id: "callerIndependentPipeConstraintFactor",
    label: "Caller independent pipe constraint factor",
    kind: "number",
  },
  {
    id: "callerPipeElasticModulusPascals",
    label: "Caller pipe elastic modulus pascals",
    kind: "number",
  },
  {
    id: "actualWallThicknessMeters",
    label: "Actual wall thickness meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerFluidBulkModulusPascals,
    "callerFluidBulkModulusPascals",
  );
  positive(
    input.callerFluidDensityKgPerCubicMeter,
    "callerFluidDensityKgPerCubicMeter",
  );
  positive(
    input.actualPipeInnerDiameterMeters,
    "actualPipeInnerDiameterMeters",
  );
  nonnegative(
    input.callerIndependentPipeConstraintFactor,
    "callerIndependentPipeConstraintFactor",
  );
  positive(
    input.callerPipeElasticModulusPascals,
    "callerPipeElasticModulusPascals",
  );
  positive(input.actualWallThicknessMeters, "actualWallThicknessMeters");
  if (
    input.actualWallThicknessMeters / input.actualPipeInnerDiameterMeters >
    0.1
  )
    simpleError("wall", "Declared thin pipe t/D≤.1.");
  return {
    value: Math.sqrt(
      input.callerFluidBulkModulusPascals /
        (input.callerFluidDensityKgPerCubicMeter *
          (1 +
            (input.callerFluidBulkModulusPascals *
              input.actualPipeInnerDiameterMeters *
              input.callerIndependentPipeConstraintFactor) /
              (input.callerPipeElasticModulusPascals *
                input.actualWallThicknessMeters))),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerFluidBulkModulusPascals: 4,
    callerFluidDensityKgPerCubicMeter: 1,
    actualPipeInnerDiameterMeters: 1,
    callerIndependentPipeConstraintFactor: 0.25,
    callerPipeElasticModulusPascals: 10,
    actualWallThicknessMeters: 0.1,
  },
  output: { result: { value: 1.4142135623730951 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-hammer-wave-speed",
  title: "Plumbing Water Hammer Wave Speed Calculator",
  description:
    "Explicit Kortewegthin-elastic pipe pressure wave speed sqrt[K/(\u03c1(1+KDC/(Et)))], independent constraintfactorC, small strain matched single phase fluid; not water hammer surge pressure or safety. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
