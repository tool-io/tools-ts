import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldPhrase: string;
  readonly callerOrderedChargePhrases: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldPhrase", label: "Field phrase", kind: "string" },
  {
    id: "callerOrderedChargePhrases",
    label: "Caller ordered charge phrases",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.fieldPhrase.trim() ||
    input.callerOrderedChargePhrases.some(
      (v) => !v.trim() || /[.\r\n]/.test(v),
    ) ||
    /[.\r\n]/.test(input.fieldPhrase)
  )
    simpleError(
      "phrases",
      "Explicit already grammatically reviewed phrases, no embedded sentence stops/newlines.",
    );
  return {
    blazonSentence:
      [input.fieldPhrase, ...input.callerOrderedChargePhrases].join(", ") + ".",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    fieldPhrase: "Or",
    callerOrderedChargePhrases: ["a lion gules", "a chief azure"],
  },
  output: { result: { blazonSentence: "Or, a lion gules, a chief azure." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/fields-to-blazon-serializer",
  title: "Structured Fields to Blazon Sentence Serializer",
  description:
    "Serialize already independently reviewed ordered English field/charge phrases; not automatic agreement, syntax or legal blazon generation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
