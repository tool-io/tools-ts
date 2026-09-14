import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualRegionalIndicatorPair: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRegionalIndicatorPair",
    label: "Actual regional indicator pair",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = Array.from(input.actualRegionalIndicatorPair);
  if (
    a.length !== 2 ||
    a.some((c) => c.codePointAt(0)! < 0x1f1e6 || c.codePointAt(0)! > 0x1f1ff)
  )
    simpleError("emoji", "Exacttworegionalindicators.");
  return {
    literalAlpha2Code: a
      .map((c) => String.fromCharCode(c.codePointAt(0)! - 0x1f1e6 + 65))
      .join(""),
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
  input: { actualRegionalIndicatorPair: "\ud83c\uddec\ud83c\udde7" },
  output: { result: { literalAlpha2Code: "GB" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/emoji-to-iso-alpha2",
  title: "Flag Emoji to ISO Alpha-2 Decoder",
  description:
    "Literalregionalindicatorpair\u2192ASCIIalpha2decoder,not subdivisiontag/language/renderedflagor currentISOassigned-countryvalidator. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
