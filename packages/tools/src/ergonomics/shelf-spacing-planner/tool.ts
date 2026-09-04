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
  readonly observedObjectHeightsCm: readonly number[];
  readonly callerVerticalAccessClearancesCm: readonly number[];
  readonly observedShelfUsableHeightsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredShelfSpacingsCm: readonly number[];
  readonly signedSpacingReservesCm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObjectHeightsCm",
    label: "Observed object heights cm",
    kind: "numberList",
  },
  {
    id: "callerVerticalAccessClearancesCm",
    label: "Caller vertical access clearances cm",
    kind: "numberList",
  },
  {
    id: "observedShelfUsableHeightsCm",
    label: "Observed shelf usable heights cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedObjectHeightsCm.forEach((v) =>
    positive(v, "observedObjectHeightsCm"),
  );
  input.observedShelfUsableHeightsCm.forEach((v) =>
    positive(v, "observedShelfUsableHeightsCm"),
  );
  input.callerVerticalAccessClearancesCm.forEach((v) =>
    nonnegative(v, "callerVerticalAccessClearancesCm"),
  );
  aligned(
    input.observedObjectHeightsCm,
    input.callerVerticalAccessClearancesCm,
    "observedObjectHeightsCm",
  );
  aligned(
    input.observedObjectHeightsCm,
    input.observedShelfUsableHeightsCm,
    "observedObjectHeightsCm",
  );
  const s = input.observedObjectHeightsCm.map(
    (v, i) => v + input.callerVerticalAccessClearancesCm[i],
  );
  return {
    requiredShelfSpacingsCm: s,
    signedSpacingReservesCm: s.map(
      (v, i) => input.observedShelfUsableHeightsCm[i] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObjectHeightsCm: [10, 20],
  callerVerticalAccessClearancesCm: [5, 5],
  observedShelfUsableHeightsCm: [14, 30],
} satisfies Input;
export const exampleOutput = {
  requiredShelfSpacingsCm: [15, 25],
  signedSpacingReservesCm: [-1, 5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/shelf-spacing-planner",
  title: "Anthropometric Shelf Spacing Vertical Storage Planner",
  description:
    "Actual stored-object and access-gap shelf-spacing audit, no generic anthropometric reach or optimal packing. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredShelfSpacingsCm",
      label: "Required shelf spacings cm",
      kind: "numberList",
    },
    {
      id: "signedSpacingReservesCm",
      label: "Signed spacing reserves cm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedObjectHeightsCm:
        value.observedObjectHeightsCm as readonly number[],
      callerVerticalAccessClearancesCm:
        value.callerVerticalAccessClearancesCm as readonly number[],
      observedShelfUsableHeightsCm:
        value.observedShelfUsableHeightsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
