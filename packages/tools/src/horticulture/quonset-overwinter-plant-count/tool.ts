import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedUsableWinterBenchAreaM2: number;
  readonly callerAllocatedM2PerContainer: number;
  readonly existingContainerCount: number;
  readonly callerReservedEmptyPositions: number;
}>;
export type Output = Readonly<{
  readonly modeledWholeContainerPositions: number;
  readonly additionalContainerPositionsAvailable: number;
  readonly overallocatedContainerPositions: number;
}>;
const inputFields = [
  {
    id: "observedUsableWinterBenchAreaM2",
    label: "Observed usable winter bench area m2",
    kind: "number",
  },
  {
    id: "callerAllocatedM2PerContainer",
    label: "Caller allocated m2 per container",
    kind: "number",
  },
  {
    id: "existingContainerCount",
    label: "Existing container count",
    kind: "number",
  },
  {
    id: "callerReservedEmptyPositions",
    label: "Caller reserved empty positions",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerAllocatedM2PerContainer,
    "callerAllocatedM2PerContainer",
  );
  nonnegative(
    input.observedUsableWinterBenchAreaM2,
    "observedUsableWinterBenchAreaM2",
  );
  bounded(input.existingContainerCount, "existing", 0, 1000000);
  bounded(input.callerReservedEmptyPositions, "reserve", 0, 1000000);
  const positions = bounded(
      Math.floor(
        input.observedUsableWinterBenchAreaM2 /
          input.callerAllocatedM2PerContainer,
      ),
      "capacity",
      0,
      1000000,
    ),
    committed =
      input.existingContainerCount + input.callerReservedEmptyPositions;
  return {
    modeledWholeContainerPositions: positions,
    additionalContainerPositionsAvailable: Math.max(0, positions - committed),
    overallocatedContainerPositions: Math.max(0, committed - positions),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUsableWinterBenchAreaM2: 20,
  callerAllocatedM2PerContainer: 0.5,
  existingContainerCount: 30,
  callerReservedEmptyPositions: 2,
} satisfies Input;
export const exampleOutput = {
  modeledWholeContainerPositions: 40,
  additionalContainerPositionsAvailable: 8,
  overallocatedContainerPositions: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/quonset-overwinter-plant-count",
  title: "Quonset Overwinter Plant Count Calculator",
  description:
    "Reconcile actual usable overwinter container-space budget with observed existing inventory and reserved positions; caller footprint is independently allocated, no quonset dimensions-only capacity or frost survival.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledWholeContainerPositions",
      label: "Modeled whole container positions",
      kind: "number",
    },
    {
      id: "additionalContainerPositionsAvailable",
      label: "Additional container positions available",
      kind: "number",
    },
    {
      id: "overallocatedContainerPositions",
      label: "Overallocated container positions",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUsableWinterBenchAreaM2:
        value.observedUsableWinterBenchAreaM2 as number,
      callerAllocatedM2PerContainer:
        value.callerAllocatedM2PerContainer as number,
      existingContainerCount: value.existingContainerCount as number,
      callerReservedEmptyPositions:
        value.callerReservedEmptyPositions as number,
    }),
});
export const run = tool.execute;
export default tool;
