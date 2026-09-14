import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualText: string;
  readonly actualCodepointLimit: number;
  readonly actualSuffix: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualText", label: "Actual text", kind: "string" },
  {
    id: "actualCodepointLimit",
    label: "Actual codepoint limit",
    kind: "number",
  },
  { id: "actualSuffix", label: "Actual suffix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualCodepointLimit, "limit", 0, 1000000);
  const a = Array.from(input.actualText),
    s = Array.from(input.actualSuffix);
  if (a.length <= input.actualCodepointLimit)
    return { truncatedText: input.actualText, wasTruncated: false };
  if (s.length > input.actualCodepointLimit)
    simpleError("suffix", "Suffixmustfitcodepointlimit.");
  return {
    truncatedText:
      a.slice(0, input.actualCodepointLimit - s.length).join("") +
      input.actualSuffix,
    wasTruncated: true,
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
    actualText: "A\ud83c\udf19BCD",
    actualCodepointLimit: 3,
    actualSuffix: "\u2026",
  },
  output: {
    result: { truncatedText: "A\ud83c\udf19\u2026", wasTruncated: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/truncate",
  title: "Text Truncate Tool",
  description:
    "MaximumTOTALcodepointlimitincludescaller suffix;not UTF16substring or grapheme/displaywidth preservation. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
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
