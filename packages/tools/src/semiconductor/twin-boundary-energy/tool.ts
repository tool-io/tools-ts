import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBoundaryCellTotalEnergyJ: readonly number[];
  readonly callerMatchedBulkReferenceEnergyJ: readonly number[];
  readonly observedBoundaryAreasM2: readonly number[];
  readonly callerBoundariesPerCell: number;
}>;
export type Output = Readonly<{
  readonly inferredBoundaryEnergyJM2: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBoundaryCellTotalEnergyJ",
    label: "Observed boundary cell total energy j",
    kind: "numberList",
  },
  {
    id: "callerMatchedBulkReferenceEnergyJ",
    label: "Caller matched bulk reference energy j",
    kind: "numberList",
  },
  {
    id: "observedBoundaryAreasM2",
    label: "Observed boundary areas m2",
    kind: "numberList",
  },
  {
    id: "callerBoundariesPerCell",
    label: "Caller boundaries per cell",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBoundaryAreasM2.forEach((v) =>
    positive(v, "observedBoundaryAreasM2"),
  );
  aligned(
    input.observedBoundaryCellTotalEnergyJ,
    input.callerMatchedBulkReferenceEnergyJ,
    "observedBoundaryCellTotalEnergyJ",
  );
  aligned(
    input.observedBoundaryCellTotalEnergyJ,
    input.observedBoundaryAreasM2,
    "observedBoundaryCellTotalEnergyJ",
  );
  bounded(input.callerBoundariesPerCell, "boundaries", 1, 128);
  return {
    inferredBoundaryEnergyJM2: input.observedBoundaryCellTotalEnergyJ.map(
      (v, i) =>
        (v - input.callerMatchedBulkReferenceEnergyJ[i]) /
        input.observedBoundaryAreasM2[i] /
        input.callerBoundariesPerCell,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBoundaryCellTotalEnergyJ: [10, 20],
  callerMatchedBulkReferenceEnergyJ: [8, 14],
  observedBoundaryAreasM2: [1, 3],
  callerBoundariesPerCell: 1,
} satisfies Input;
export const exampleOutput = {
  inferredBoundaryEnergyJM2: [2.0, 2.0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/twin-boundary-energy",
  title: "Semiconductor Twin Boundary Energy Calculator",
  description:
    "Audit actual twin-boundary cell excess energies over independently matched bulk reference and explicit repeated-boundary count; signed mismatch retained, not a universal interfacial energy.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredBoundaryEnergyJM2",
      label: "Inferred boundary energy j m2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBoundaryCellTotalEnergyJ:
        value.observedBoundaryCellTotalEnergyJ as readonly number[],
      callerMatchedBulkReferenceEnergyJ:
        value.callerMatchedBulkReferenceEnergyJ as readonly number[],
      observedBoundaryAreasM2:
        value.observedBoundaryAreasM2 as readonly number[],
      callerBoundariesPerCell: value.callerBoundariesPerCell as number,
    }),
});
export const run = tool.execute;
export default tool;
