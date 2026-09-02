import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerSiloLayerNetVolumesM3: readonly number[];
  readonly callerMatchedSettledLayerDensitiesKgM3: readonly number[];
  readonly callerLayerUsableFractions: readonly number[];
}>;
export type Output = Readonly<{ readonly usableSiloInventoryKg: number }>;
const inputFields = [
  {
    id: "callerSiloLayerNetVolumesM3",
    label: "Caller silo layer net volumes m3",
    kind: "numberList",
  },
  {
    id: "callerMatchedSettledLayerDensitiesKgM3",
    label: "Caller matched settled layer densities kg m3",
    kind: "numberList",
  },
  {
    id: "callerLayerUsableFractions",
    label: "Caller layer usable fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerSiloLayerNetVolumesM3.forEach((v) =>
    nonnegative(v, "callerSiloLayerNetVolumesM3"),
  );
  input.callerMatchedSettledLayerDensitiesKgM3.forEach((v) =>
    nonnegative(v, "callerMatchedSettledLayerDensitiesKgM3"),
  );
  input.callerLayerUsableFractions.forEach((v) =>
    fraction(v, "callerLayerUsableFractions"),
  );
  aligned(
    input.callerSiloLayerNetVolumesM3,
    input.callerMatchedSettledLayerDensitiesKgM3,
    "callerSiloLayerNetVolumesM3",
  );
  aligned(
    input.callerSiloLayerNetVolumesM3,
    input.callerLayerUsableFractions,
    "callerSiloLayerNetVolumesM3",
  );
  return {
    usableSiloInventoryKg: sum(
      input.callerSiloLayerNetVolumesM3.map(
        (v, i) =>
          v *
          input.callerMatchedSettledLayerDensitiesKgM3[i] *
          input.callerLayerUsableFractions[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSiloLayerNetVolumesM3: [10, 20],
  callerMatchedSettledLayerDensitiesKgM3: [100, 200],
  callerLayerUsableFractions: [0.9, 0.5],
} satisfies Input;
export const exampleOutput = { usableSiloInventoryKg: 2900 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/silo-capacity",
  title: "Agriculture Silo Capacity Calculator",
  description:
    "Separate silo layer density/availability mass inventory, not a single cylinder-volume calculator or assumed grain bulk density. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "usableSiloInventoryKg",
      label: "Usable silo inventory kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSiloLayerNetVolumesM3:
        value.callerSiloLayerNetVolumesM3 as readonly number[],
      callerMatchedSettledLayerDensitiesKgM3:
        value.callerMatchedSettledLayerDensitiesKgM3 as readonly number[],
      callerLayerUsableFractions:
        value.callerLayerUsableFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
