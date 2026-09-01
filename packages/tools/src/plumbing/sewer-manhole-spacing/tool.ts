import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSewerRunLengthM: number;
  readonly callerVerifiedMaximumAccessSpacingM: number;
  readonly observedAlreadyInstalledAccessCount: number;
}>;
export type Output = Readonly<{
  readonly requiredMinimumEndpointInclusiveAccessCount: number;
  readonly plannedEqualAccessSpacingM: number;
  readonly additionalAccessCount: number;
}>;
const inputFields = [
  {
    id: "observedSewerRunLengthM",
    label: "Observed sewer run length m",
    kind: "number",
  },
  {
    id: "callerVerifiedMaximumAccessSpacingM",
    label: "Caller verified maximum access spacing m",
    kind: "number",
  },
  {
    id: "observedAlreadyInstalledAccessCount",
    label: "Observed already installed access count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerVerifiedMaximumAccessSpacingM,
    "callerVerifiedMaximumAccessSpacingM",
  );
  nonnegative(input.observedSewerRunLengthM, "observedSewerRunLengthM");
  bounded(input.observedAlreadyInstalledAccessCount, "access", 0, 1000000);
  const intervals = bounded(
      Math.ceil(
        input.observedSewerRunLengthM /
          input.callerVerifiedMaximumAccessSpacingM,
      ),
      "intervals",
      0,
      1000000,
    ),
    count = intervals + 1;
  return {
    requiredMinimumEndpointInclusiveAccessCount: count,
    plannedEqualAccessSpacingM: intervals
      ? input.observedSewerRunLengthM / intervals
      : 0,
    additionalAccessCount: Math.max(
      0,
      count - input.observedAlreadyInstalledAccessCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSewerRunLengthM: 100,
  callerVerifiedMaximumAccessSpacingM: 30,
  observedAlreadyInstalledAccessCount: 3,
} satisfies Input;
export const exampleOutput = {
  requiredMinimumEndpointInclusiveAccessCount: 5,
  plannedEqualAccessSpacingM: 25,
  additionalAccessCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/sewer-manhole-spacing",
  title: "Plumbing Sewer Manhole Spacing Calculator",
  description:
    "Budget observed sewer linear run under independently verified access spacing, endpoint-inclusive positions; actual bends/junction access excluded, no universal manhole regulation or confined-space permission.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredMinimumEndpointInclusiveAccessCount",
      label: "Required minimum endpoint inclusive access count",
      kind: "number",
    },
    {
      id: "plannedEqualAccessSpacingM",
      label: "Planned equal access spacing m",
      kind: "number",
    },
    {
      id: "additionalAccessCount",
      label: "Additional access count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSewerRunLengthM: value.observedSewerRunLengthM as number,
      callerVerifiedMaximumAccessSpacingM:
        value.callerVerifiedMaximumAccessSpacingM as number,
      observedAlreadyInstalledAccessCount:
        value.observedAlreadyInstalledAccessCount as number,
    }),
});
export const run = tool.execute;
export default tool;
