import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  strictlyIncreasing,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedHolePositionsMm: readonly number[];
  readonly coincidenceToleranceMm: number;
}>;
export type Output = Readonly<{
  readonly distinctHoleCount: number;
  readonly groupStartPositionsMm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedHolePositionsMm",
    label: "Observed hole positions mm",
    kind: "numberList",
  },
  {
    id: "coincidenceToleranceMm",
    label: "Coincidence tolerance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.coincidenceToleranceMm, "coincidenceToleranceMm");
  input.observedHolePositionsMm.forEach((v) =>
    nonnegative(v, "observedHolePositionsMm"),
  );
  strictlyIncreasing(input.observedHolePositionsMm, "positions", 1);
  const groups: number[] = [];
  input.observedHolePositionsMm.forEach((v) => {
    if (
      !groups.length ||
      v - groups[groups.length - 1] > input.coincidenceToleranceMm
    )
      groups.push(v);
  });
  return { distinctHoleCount: groups.length, groupStartPositionsMm: groups };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHolePositionsMm: [1, 4, 10],
  coincidenceToleranceMm: 0.1,
} satisfies Input;
export const exampleOutput = {
  distinctHoleCount: 3,
  groupStartPositionsMm: [1, 4, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/booklet-pane-stitch-counter",
  title: "Booklet Panes Stitching Hole Pattern Counter",
  description:
    "Count sorted observed stitching-hole position clusters with explicit start-anchored tolerance; not booklet authenticity. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "distinctHoleCount", label: "Distinct hole count", kind: "number" },
    {
      id: "groupStartPositionsMm",
      label: "Group start positions mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHolePositionsMm:
        value.observedHolePositionsMm as readonly number[],
      coincidenceToleranceMm: value.coincidenceToleranceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
