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
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedExcavatedHoleVolumesLiters: readonly number[];
  readonly measuredRootballDisplacementLiters: readonly number[];
  readonly measuredReturnedNativeSoilLiters: readonly number[];
  readonly callerFillVolumeCompactionFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredLooseImportedBackfillLitersByHole: readonly number[];
  readonly totalRequiredLooseImportedLiters: number;
}>;
const inputFields = [
  {
    id: "observedExcavatedHoleVolumesLiters",
    label: "Observed excavated hole volumes liters",
    kind: "numberList",
  },
  {
    id: "measuredRootballDisplacementLiters",
    label: "Measured rootball displacement liters",
    kind: "numberList",
  },
  {
    id: "measuredReturnedNativeSoilLiters",
    label: "Measured returned native soil liters",
    kind: "numberList",
  },
  {
    id: "callerFillVolumeCompactionFraction",
    label: "Caller fill volume compaction fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerFillVolumeCompactionFraction,
    "callerFillVolumeCompactionFraction",
  );
  input.observedExcavatedHoleVolumesLiters.forEach((v) =>
    nonnegative(v, "observedExcavatedHoleVolumesLiters"),
  );
  input.measuredRootballDisplacementLiters.forEach((v) =>
    nonnegative(v, "measuredRootballDisplacementLiters"),
  );
  input.measuredReturnedNativeSoilLiters.forEach((v) =>
    nonnegative(v, "measuredReturnedNativeSoilLiters"),
  );
  fraction(
    input.callerFillVolumeCompactionFraction,
    "callerFillVolumeCompactionFraction",
  );
  aligned(
    input.observedExcavatedHoleVolumesLiters,
    input.measuredRootballDisplacementLiters,
    "observedExcavatedHoleVolumesLiters",
  );
  aligned(
    input.observedExcavatedHoleVolumesLiters,
    input.measuredReturnedNativeSoilLiters,
    "observedExcavatedHoleVolumesLiters",
  );
  const gaps = input.observedExcavatedHoleVolumesLiters.map(
    (v, i) =>
      v -
      input.measuredRootballDisplacementLiters[i] -
      input.measuredReturnedNativeSoilLiters[i],
  );
  if (gaps.some((v) => v < 0))
    simpleError(
      "backfill",
      "Independent returned-soil/rootball volumes exceed measured hole inventory.",
    );
  const loose = gaps.map((v) => v / input.callerFillVolumeCompactionFraction);
  return {
    requiredLooseImportedBackfillLitersByHole: loose,
    totalRequiredLooseImportedLiters: sum(loose),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedExcavatedHoleVolumesLiters: [20, 30],
  measuredRootballDisplacementLiters: [5, 10],
  measuredReturnedNativeSoilLiters: [10, 10],
  callerFillVolumeCompactionFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  requiredLooseImportedBackfillLitersByHole: [6.25, 12.5],
  totalRequiredLooseImportedLiters: 18.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/planting-hole-backfill-volume",
  title: "Planting Hole Backfill Volume Calculator",
  description:
    "Reconcile actual excavation, rootball and returned soil volume with independently calibrated imported-fill compaction; not cylinder hole geometry, root suitability or planting recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredLooseImportedBackfillLitersByHole",
      label: "Required loose imported backfill liters by hole",
      kind: "numberList",
    },
    {
      id: "totalRequiredLooseImportedLiters",
      label: "Total required loose imported liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedExcavatedHoleVolumesLiters:
        value.observedExcavatedHoleVolumesLiters as readonly number[],
      measuredRootballDisplacementLiters:
        value.measuredRootballDisplacementLiters as readonly number[],
      measuredReturnedNativeSoilLiters:
        value.measuredReturnedNativeSoilLiters as readonly number[],
      callerFillVolumeCompactionFraction:
        value.callerFillVolumeCompactionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
