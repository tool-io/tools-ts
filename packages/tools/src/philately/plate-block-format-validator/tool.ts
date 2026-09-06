import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedPlateNumberText: string;
  readonly callerAcceptedLiteralFormats: readonly string[];
}>;
export type Output = Readonly<{ readonly matchesCallerLiteralFormat: boolean }>;
const inputFields = [
  {
    id: "observedPlateNumberText",
    label: "Observed plate number text",
    kind: "string",
  },
  {
    id: "callerAcceptedLiteralFormats",
    label: "Caller accepted literal formats",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerAcceptedLiteralFormats, "plate formats");
  return {
    matchesCallerLiteralFormat: input.callerAcceptedLiteralFormats.includes(
      input.observedPlateNumberText,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlateNumberText: "0012",
  callerAcceptedLiteralFormats: ["0012", "0013"],
} satisfies Input;
export const exampleOutput = {
  matchesCallerLiteralFormat: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/plate-block-format-validator",
  title: "Plate Block Margin Number Format Validator",
  description:
    "Validate exact plate-block number text against caller issue-specific accepted literal formats; preserves leading zeros. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchesCallerLiteralFormat",
      label: "Matches caller literal format",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlateNumberText: value.observedPlateNumberText as string,
      callerAcceptedLiteralFormats:
        value.callerAcceptedLiteralFormats as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
