import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly layerVolumesM3: readonly number[];
  readonly measuredOxygenMgPerLiter: readonly number[];
  readonly referenceSaturationMgPerLiter: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedLayerOxygenDeficitsKg: readonly number[];
  readonly totalSignedOxygenDeficitKg: number;
}>;
const inputFields = [
  { id: "layerVolumesM3", label: "Layer volumes m3", kind: "numberList" },
  {
    id: "measuredOxygenMgPerLiter",
    label: "Measured oxygen mg per liter",
    kind: "numberList",
  },
  {
    id: "referenceSaturationMgPerLiter",
    label: "Reference saturation mg per liter",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.layerVolumesM3.forEach((v) => positive(v, "layerVolumesM3"));
  input.measuredOxygenMgPerLiter.forEach((v) =>
    nonnegative(v, "measuredOxygenMgPerLiter"),
  );
  input.referenceSaturationMgPerLiter.forEach((v) =>
    nonnegative(v, "referenceSaturationMgPerLiter"),
  );
  aligned(
    input.layerVolumesM3,
    input.measuredOxygenMgPerLiter,
    "layerVolumesM3",
  );
  aligned(
    input.layerVolumesM3,
    input.referenceSaturationMgPerLiter,
    "layerVolumesM3",
  );
  const signedLayerOxygenDeficitsKg = input.layerVolumesM3.map(
    (v, i) =>
      (v *
        (input.referenceSaturationMgPerLiter[i] -
          input.measuredOxygenMgPerLiter[i])) /
      1000,
  );
  return {
    signedLayerOxygenDeficitsKg,
    totalSignedOxygenDeficitKg: signedLayerOxygenDeficitsKg.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerVolumesM3: [100, 200],
  measuredOxygenMgPerLiter: [8, 4],
  referenceSaturationMgPerLiter: [10, 10],
} satisfies Input;
export const exampleOutput = {
  signedLayerOxygenDeficitsKg: [0.2, 1.2],
  totalSignedOxygenDeficitKg: 1.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/oxygen-deficit-absolute",
  title: "Oxygen Deficit Absolute",
  description:
    "Integrate oxygen deficit against supplied layer-specific saturation references and volumes; supersaturated layers contribute negative deficits, unlike a saturation-concentration model.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedLayerOxygenDeficitsKg",
      label: "Signed layer oxygen deficits kg",
      kind: "numberList",
    },
    {
      id: "totalSignedOxygenDeficitKg",
      label: "Total signed oxygen deficit kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerVolumesM3: value.layerVolumesM3 as readonly number[],
      measuredOxygenMgPerLiter:
        value.measuredOxygenMgPerLiter as readonly number[],
      referenceSaturationMgPerLiter:
        value.referenceSaturationMgPerLiter as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
