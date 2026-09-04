import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedShoulderBreadthsCm: readonly number[];
  readonly observedDoorwayWidthsCm: readonly number[];
  readonly callerSideClearancesCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedDoorwayReservesCm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedShoulderBreadthsCm",
    label: "Observed shoulder breadths cm",
    kind: "numberList",
  },
  {
    id: "observedDoorwayWidthsCm",
    label: "Observed doorway widths cm",
    kind: "numberList",
  },
  {
    id: "callerSideClearancesCm",
    label: "Caller side clearances cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedShoulderBreadthsCm.forEach((v) =>
    positive(v, "observedShoulderBreadthsCm"),
  );
  input.observedDoorwayWidthsCm.forEach((v) =>
    positive(v, "observedDoorwayWidthsCm"),
  );
  input.callerSideClearancesCm.forEach((v) =>
    nonnegative(v, "callerSideClearancesCm"),
  );
  aligned(
    input.observedShoulderBreadthsCm,
    input.observedDoorwayWidthsCm,
    "observedShoulderBreadthsCm",
  );
  aligned(
    input.observedShoulderBreadthsCm,
    input.callerSideClearancesCm,
    "observedShoulderBreadthsCm",
  );
  return {
    signedDoorwayReservesCm: input.observedDoorwayWidthsCm.map(
      (v, i) =>
        v -
        input.observedShoulderBreadthsCm[i] -
        2 * input.callerSideClearancesCm[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShoulderBreadthsCm: [40, 45],
  observedDoorwayWidthsCm: [55, 50],
  callerSideClearancesCm: [5, 5],
} satisfies Input;
export const exampleOutput = {
  signedDoorwayReservesCm: [5, -5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/shoulder-breadth-clearance-checker",
  title: "Anthropometric Shoulder Breadth Doorway Clearance Checker",
  description:
    "Actual shoulder/doorway two-sided clearance audit with measured clothing/side-clearance policy; not fire-egress compliance. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedDoorwayReservesCm",
      label: "Signed doorway reserves cm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShoulderBreadthsCm:
        value.observedShoulderBreadthsCm as readonly number[],
      observedDoorwayWidthsCm:
        value.observedDoorwayWidthsCm as readonly number[],
      callerSideClearancesCm: value.callerSideClearancesCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
