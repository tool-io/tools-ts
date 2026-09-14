import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFirstOnset: string;
  readonly actualFirstRime: string;
  readonly actualSecondOnset: string;
  readonly actualSecondRime: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFirstOnset", label: "Actual first onset", kind: "string" },
  { id: "actualFirstRime", label: "Actual first rime", kind: "string" },
  { id: "actualSecondOnset", label: "Actual second onset", kind: "string" },
  { id: "actualSecondRime", label: "Actual second rime", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    [
      input.actualFirstOnset,
      input.actualFirstRime,
      input.actualSecondOnset,
      input.actualSecondRime,
    ].some((v) => !v.trim())
  )
    simpleError("segments", "Explicitindependentlysegmentedonsets/rimes.");
  return {
    spoonerizedWords: [
      input.actualSecondOnset + input.actualFirstRime,
      input.actualFirstOnset + input.actualSecondRime,
    ],
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualFirstOnset: "b",
    actualFirstRime: "old",
    actualSecondOnset: "c",
    actualSecondRime: "at",
  },
  output: { result: { spoonerizedWords: ["cold", "bat"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/spoonerism-maker",
  title: "Spoonerism Maker",
  description:
    "CallerphonologicallysegmentedonsetexchangeSpoonerism,not inferphonemeonsetsfrom spelling. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
