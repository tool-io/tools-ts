import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly preTrafficDryBulkDensitiesKgPerM3: readonly number[];
  readonly postTrafficDryBulkDensitiesKgPerM3: readonly number[];
  readonly representedCoreVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly pairedDensityPercentChanges: readonly number[];
  readonly volumeWeightedDensityPercentChange: number;
}>;
const inputFields = [
  {
    id: "preTrafficDryBulkDensitiesKgPerM3",
    label: "Pre traffic dry bulk densities kg per m3",
    kind: "numberList",
  },
  {
    id: "postTrafficDryBulkDensitiesKgPerM3",
    label: "Post traffic dry bulk densities kg per m3",
    kind: "numberList",
  },
  {
    id: "representedCoreVolumesM3",
    label: "Represented core volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.preTrafficDryBulkDensitiesKgPerM3.forEach((v) =>
    positive(v, "preTrafficDryBulkDensitiesKgPerM3"),
  );
  input.postTrafficDryBulkDensitiesKgPerM3.forEach((v) =>
    positive(v, "postTrafficDryBulkDensitiesKgPerM3"),
  );
  input.representedCoreVolumesM3.forEach((v) =>
    positive(v, "representedCoreVolumesM3"),
  );
  aligned(
    input.preTrafficDryBulkDensitiesKgPerM3,
    input.postTrafficDryBulkDensitiesKgPerM3,
    "preTrafficDryBulkDensitiesKgPerM3",
  );
  aligned(
    input.preTrafficDryBulkDensitiesKgPerM3,
    input.representedCoreVolumesM3,
    "preTrafficDryBulkDensitiesKgPerM3",
  );
  const before = input.preTrafficDryBulkDensitiesKgPerM3.reduce(
      (s, v, i) => s + v * input.representedCoreVolumesM3[i],
      0,
    ),
    after = input.postTrafficDryBulkDensitiesKgPerM3.reduce(
      (s, v, i) => s + v * input.representedCoreVolumesM3[i],
      0,
    );
  return {
    pairedDensityPercentChanges: input.preTrafficDryBulkDensitiesKgPerM3.map(
      (v, i) => (100 * (input.postTrafficDryBulkDensitiesKgPerM3[i] - v)) / v,
    ),
    volumeWeightedDensityPercentChange: (100 * (after - before)) / before,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preTrafficDryBulkDensitiesKgPerM3: [1000, 1200],
  postTrafficDryBulkDensitiesKgPerM3: [1200, 1100],
  representedCoreVolumesM3: [1, 2],
} satisfies Input;
export const exampleOutput = {
  pairedDensityPercentChanges: [20, -8.333333333333334],
  volumeWeightedDensityPercentChange: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/soil-compaction-bulk-density-increase-percent-skid-trail",
  title: "Skid Trail Bulk Density Compaction Percent Increase",
  description:
    "Compare matched dry bulk-density cores using paired and physical-volume-weighted contrasts, preserving apparent decompaction; unlike simple porosity conversion, no compaction damage or trafficability conclusion.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairedDensityPercentChanges",
      label: "Paired density percent changes",
      kind: "numberList",
    },
    {
      id: "volumeWeightedDensityPercentChange",
      label: "Volume weighted density percent change",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      preTrafficDryBulkDensitiesKgPerM3:
        value.preTrafficDryBulkDensitiesKgPerM3 as readonly number[],
      postTrafficDryBulkDensitiesKgPerM3:
        value.postTrafficDryBulkDensitiesKgPerM3 as readonly number[],
      representedCoreVolumesM3:
        value.representedCoreVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
