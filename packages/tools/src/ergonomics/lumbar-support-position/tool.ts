import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedSeatDatumFloorCm: number;
  readonly observedLumbarLandmarkAboveSeatCm: number;
  readonly callerSupportCenterOffsetCm: number;
}>;
export type Output = Readonly<{
  readonly conditionalSupportCenterFloorCm: number;
}>;
const inputFields = [
  {
    id: "observedSeatDatumFloorCm",
    label: "Observed seat datum floor cm",
    kind: "number",
  },
  {
    id: "observedLumbarLandmarkAboveSeatCm",
    label: "Observed lumbar landmark above seat cm",
    kind: "number",
  },
  {
    id: "callerSupportCenterOffsetCm",
    label: "Caller support center offset cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedLumbarLandmarkAboveSeatCm,
    "observedLumbarLandmarkAboveSeatCm",
  );
  nonnegative(input.observedSeatDatumFloorCm, "observedSeatDatumFloorCm");
  return {
    conditionalSupportCenterFloorCm: positive(
      input.observedSeatDatumFloorCm +
        input.observedLumbarLandmarkAboveSeatCm +
        input.callerSupportCenterOffsetCm,
      "support location",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSeatDatumFloorCm: 45,
  observedLumbarLandmarkAboveSeatCm: 20,
  callerSupportCenterOffsetCm: -2,
} satisfies Input;
export const exampleOutput = {
  conditionalSupportCenterFloorCm: 63,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/lumbar-support-position",
  title: "Lumbar Support Height Position Calculator",
  description:
    "Actual lumbar landmark location plus independent support offset, not inferred anatomy from body height. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalSupportCenterFloorCm",
      label: "Conditional support center floor cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSeatDatumFloorCm: value.observedSeatDatumFloorCm as number,
      observedLumbarLandmarkAboveSeatCm:
        value.observedLumbarLandmarkAboveSeatCm as number,
      callerSupportCenterOffsetCm: value.callerSupportCenterOffsetCm as number,
    }),
});
export const run = tool.execute;
export default tool;
