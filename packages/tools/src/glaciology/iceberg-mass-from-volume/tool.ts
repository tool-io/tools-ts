import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly icebergSegmentVolumesM3: readonly number[];
  readonly segmentDensitiesKgM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly segmentMassesKg: readonly number[];
  readonly totalIcebergMassKg: number;
  readonly bulkDensityKgM3: number;
}>;
const inputFields = [
  {
    id: "icebergSegmentVolumesM3",
    label: "Iceberg segment volumes m3",
    kind: "numberList",
  },
  {
    id: "segmentDensitiesKgM3",
    label: "Segment densities kg m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.segmentDensitiesKgM3.forEach((v) =>
    positive(v, "segmentDensitiesKgM3"),
  );
  input.icebergSegmentVolumesM3.forEach((v) =>
    nonnegative(v, "icebergSegmentVolumesM3"),
  );
  aligned(
    input.icebergSegmentVolumesM3,
    input.segmentDensitiesKgM3,
    "icebergSegmentVolumesM3",
  );
  const volumes = positive(sum(input.icebergSegmentVolumesM3), "volume"),
    masses = input.icebergSegmentVolumesM3.map(
      (v, i) => v * input.segmentDensitiesKgM3[i],
    ),
    mass = sum(masses);
  return {
    segmentMassesKg: masses,
    totalIcebergMassKg: mass,
    bulkDensityKgM3: mass / volumes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  icebergSegmentVolumesM3: [10, 20],
  segmentDensitiesKgM3: [900, 800],
} satisfies Input;
export const exampleOutput = {
  segmentMassesKg: [9000, 16000],
  totalIcebergMassKg: 25000,
  bulkDensityKgM3: 833.3333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/iceberg-mass-from-volume",
  title: "Iceberg Mass From Volume Calculator",
  description:
    "Integrate caller segmented iceberg inventory with heterogeneous density and report bulk density; not generic scalar volume-mass conversion or buoyancy/freeboard inference.",
  inputs: inputFields,
  outputs: [
    { id: "segmentMassesKg", label: "Segment masses kg", kind: "numberList" },
    {
      id: "totalIcebergMassKg",
      label: "Total iceberg mass kg",
      kind: "number",
    },
    { id: "bulkDensityKgM3", label: "Bulk density kg m3", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      icebergSegmentVolumesM3:
        value.icebergSegmentVolumesM3 as readonly number[],
      segmentDensitiesKgM3: value.segmentDensitiesKgM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
