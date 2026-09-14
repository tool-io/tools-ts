import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualLiteralAlpha2Code: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLiteralAlpha2Code",
    label: "Actual literal alpha2 code",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!/^[A-Z]{2}$/.test(input.actualLiteralAlpha2Code))
    simpleError("code", "Exactlytwo uppercaseASCIIletters.");
  return {
    regionalIndicatorPair: Array.from(input.actualLiteralAlpha2Code)
      .map((c) => String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1f1e6))
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
  input: { actualLiteralAlpha2Code: "GB" },
  output: { result: { regionalIndicatorPair: "\ud83c\uddec\ud83c\udde7" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/iso-alpha2-to-emoji",
  title: "Country ISO Alpha-2 to Flag Emoji Converter",
  description:
    "LiteralASCIIalpha2\u2192regionalindicatorpairencoding,not ISOassignment/livecountryregistry/flagdisplayguarantee. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
