import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, utf8 } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualJsonText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualJsonText", label: "Actual json text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  let x: unknown;
  try {
    x = JSON.parse(input.actualJsonText);
  } catch {
    return simpleError("JSON", "ValidJSONtextrequired.");
  }
  return { normalizedJsonUtf8Bytes: utf8(JSON.stringify(x)) };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualJsonText: '{"x":"\ud83c\udf19"}' },
  output: { result: { normalizedJsonUtf8Bytes: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/size-bytes",
  title: "JSON Byte Size Tool",
  description:
    "ActualJSON.parse\u2192compactJSON.stringifyUTF8bytes,countnormalizedserializationnotoriginalwhitespace bytes;isolatedsurrogatesescaped byJSON.stringify. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
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
