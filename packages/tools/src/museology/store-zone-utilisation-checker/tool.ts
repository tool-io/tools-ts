import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned, sum } from "../shared.js";
export type Input = Readonly<{
  readonly zoneAllocatedUsableVolumesM3: readonly number[];
  readonly zoneObjectOccupiedVolumesM3: readonly number[];
  readonly zoneCommittedIncomingVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly zoneSignedCapacityMarginsM3: readonly number[];
  readonly zonesWithCommittedOverflowFlags: readonly number[];
  readonly aggregateSignedCapacityMarginM3: number;
}>;
const inputFields = [
  {
    id: "zoneAllocatedUsableVolumesM3",
    label: "Zone allocated usable volumes m3",
    kind: "numberList",
  },
  {
    id: "zoneObjectOccupiedVolumesM3",
    label: "Zone object occupied volumes m3",
    kind: "numberList",
  },
  {
    id: "zoneCommittedIncomingVolumesM3",
    label: "Zone committed incoming volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.zoneAllocatedUsableVolumesM3.forEach((v) =>
    nonnegative(v, "zoneAllocatedUsableVolumesM3"),
  );
  input.zoneObjectOccupiedVolumesM3.forEach((v) =>
    nonnegative(v, "zoneObjectOccupiedVolumesM3"),
  );
  input.zoneCommittedIncomingVolumesM3.forEach((v) =>
    nonnegative(v, "zoneCommittedIncomingVolumesM3"),
  );
  aligned(
    input.zoneAllocatedUsableVolumesM3,
    input.zoneObjectOccupiedVolumesM3,
    "zoneAllocatedUsableVolumesM3",
  );
  aligned(
    input.zoneAllocatedUsableVolumesM3,
    input.zoneCommittedIncomingVolumesM3,
    "zoneAllocatedUsableVolumesM3",
  );
  const d = input.zoneAllocatedUsableVolumesM3.map(
    (v, i) =>
      v -
      input.zoneObjectOccupiedVolumesM3[i] -
      input.zoneCommittedIncomingVolumesM3[i],
  );
  return {
    zoneSignedCapacityMarginsM3: d,
    zonesWithCommittedOverflowFlags: d.map((v) => (v < 0 ? 1 : 0)),
    aggregateSignedCapacityMarginM3: sum(d),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  zoneAllocatedUsableVolumesM3: [10, 20],
  zoneObjectOccupiedVolumesM3: [5, 15],
  zoneCommittedIncomingVolumesM3: [6, 2],
} satisfies Input;
export const exampleOutput = {
  zoneSignedCapacityMarginsM3: [-1, 3],
  zonesWithCommittedOverflowFlags: [1, 0],
  aggregateSignedCapacityMarginM3: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/store-zone-utilisation-checker",
  title: "Store Environmental Zone Capacity Utilisation Checker",
  description:
    "Audit committed environmental-zone volume deficits without treating surplus in an incompatible zone as a local solution; unlike slot occupancy, incoming reserved volume is explicit.",
  inputs: inputFields,
  outputs: [
    {
      id: "zoneSignedCapacityMarginsM3",
      label: "Zone signed capacity margins m3",
      kind: "numberList",
    },
    {
      id: "zonesWithCommittedOverflowFlags",
      label: "Zones with committed overflow flags",
      kind: "numberList",
    },
    {
      id: "aggregateSignedCapacityMarginM3",
      label: "Aggregate signed capacity margin m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      zoneAllocatedUsableVolumesM3:
        value.zoneAllocatedUsableVolumesM3 as readonly number[],
      zoneObjectOccupiedVolumesM3:
        value.zoneObjectOccupiedVolumesM3 as readonly number[],
      zoneCommittedIncomingVolumesM3:
        value.zoneCommittedIncomingVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
