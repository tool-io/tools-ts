import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly bedLarvaCounts: readonly number[];
  readonly usableBedAreasM2: readonly number[];
  readonly callerMaximumDensitiesPerM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly measuredDensitiesPerM2: readonly number[];
  readonly densityExcessLarvae: readonly number[];
  readonly aboveCallerDensityFlags: readonly number[];
}>;
const inputFields = [
  { id: "bedLarvaCounts", label: "Bed larva counts", kind: "numberList" },
  { id: "usableBedAreasM2", label: "Usable bed areas m2", kind: "numberList" },
  {
    id: "callerMaximumDensitiesPerM2",
    label: "Caller maximum densities per m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.usableBedAreasM2.forEach((v) => positive(v, "usableBedAreasM2"));
  input.callerMaximumDensitiesPerM2.forEach((v) =>
    positive(v, "callerMaximumDensitiesPerM2"),
  );
  input.bedLarvaCounts.forEach((v) => count(v, "bedLarvaCounts"));
  aligned(input.bedLarvaCounts, input.usableBedAreasM2, "bedLarvaCounts");
  aligned(
    input.bedLarvaCounts,
    input.callerMaximumDensitiesPerM2,
    "bedLarvaCounts",
  );
  return {
    measuredDensitiesPerM2: input.bedLarvaCounts.map(
      (v, i) => v / input.usableBedAreasM2[i],
    ),
    densityExcessLarvae: input.bedLarvaCounts.map(
      (v, i) =>
        v - input.usableBedAreasM2[i] * input.callerMaximumDensitiesPerM2[i],
    ),
    aboveCallerDensityFlags: input.bedLarvaCounts.map((v, i) =>
      v > input.usableBedAreasM2[i] * input.callerMaximumDensitiesPerM2[i]
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bedLarvaCounts: [100, 200],
  usableBedAreasM2: [1, 1],
  callerMaximumDensitiesPerM2: [150, 150],
} satisfies Input;
export const exampleOutput = {
  measuredDensitiesPerM2: [100, 200],
  densityExcessLarvae: [-50, 50],
  aboveCallerDensityFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/bed-spacing-density-checker",
  title: "Bed Spacing Density Checker",
  description:
    "Audit actual bed inventories against stage-specific caller density limits; signed excess preserves spare capacity and is distinct from DFL forecast bed sizing.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredDensitiesPerM2",
      label: "Measured densities per m2",
      kind: "numberList",
    },
    {
      id: "densityExcessLarvae",
      label: "Density excess larvae",
      kind: "numberList",
    },
    {
      id: "aboveCallerDensityFlags",
      label: "Above caller density flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      bedLarvaCounts: value.bedLarvaCounts as readonly number[],
      usableBedAreasM2: value.usableBedAreasM2 as readonly number[],
      callerMaximumDensitiesPerM2:
        value.callerMaximumDensitiesPerM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
