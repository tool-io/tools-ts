import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedRegistrationCmykPercent: readonly number[];
  readonly callerChannelTolerancePercentagePoints: number;
}>;
export type Output = Readonly<{
  readonly missingFullCoverageChannelIndices: readonly number[];
  readonly registrationAllFourChannelsWithinPolicy: boolean;
  readonly totalObservedRegistrationInkPercent: number;
}>;
const inputFields = [
  {
    id: "observedRegistrationCmykPercent",
    label: "Observed registration cmyk percent",
    kind: "numberList",
  },
  {
    id: "callerChannelTolerancePercentagePoints",
    label: "Caller channel tolerance percentage points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerChannelTolerancePercentagePoints,
    "callerChannelTolerancePercentagePoints",
  );
  if (
    input.observedRegistrationCmykPercent.length !== 4 ||
    input.callerChannelTolerancePercentagePoints > 1
  )
    simpleError(
      "registration",
      "Four observed CMYK percentages and caller tolerance [0,1] percentage points required.",
    );
  input.observedRegistrationCmykPercent.forEach((v) => {
    if (v < 0 || v > 100)
      simpleError("ink", "Ink percent in [0,100] required.");
  });
  const indices = input.observedRegistrationCmykPercent.flatMap((v, i) =>
    100 - v > input.callerChannelTolerancePercentagePoints ? [i] : [],
  );
  return {
    missingFullCoverageChannelIndices: indices,
    registrationAllFourChannelsWithinPolicy: indices.length === 0,
    totalObservedRegistrationInkPercent: sum(
      input.observedRegistrationCmykPercent,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRegistrationCmykPercent: [100, 100, 100, 100],
  callerChannelTolerancePercentagePoints: 0,
} satisfies Input;
export const exampleOutput = {
  missingFullCoverageChannelIndices: [],
  registrationAllFourChannelsWithinPolicy: true,
  totalObservedRegistrationInkPercent: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/registration-mark-cmyk-100-all-checker",
  title: "Registration Mark CMYK 100% All Check",
  description:
    "Check observed registration-mark process separations for 100% in all four channels under tiny caller measurement tolerance; mark-only screen, not permission to print 400% ink in ordinary art or a press-safety test.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingFullCoverageChannelIndices",
      label: "Missing full coverage channel indices",
      kind: "numberList",
    },
    {
      id: "registrationAllFourChannelsWithinPolicy",
      label: "Registration all four channels within policy",
      kind: "boolean",
    },
    {
      id: "totalObservedRegistrationInkPercent",
      label: "Total observed registration ink percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRegistrationCmykPercent:
        value.observedRegistrationCmykPercent as readonly number[],
      callerChannelTolerancePercentagePoints:
        value.callerChannelTolerancePercentagePoints as number,
    }),
});
export const run = tool.execute;
export default tool;
