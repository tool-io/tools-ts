import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, callExisting } from "../batch53-shared.js";
import base from "../../http/content-type-parser/tool.js";
export type Input = Readonly<{ contentType: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "contentType", label: "Content type", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const result = callExisting(base, { header: i.contentType }),
    type = result.mediaType as string,
    subtype = type.split("/")[1],
    k = subtype.lastIndexOf("+");
  return {
    mediaType: type,
    structuredSuffix:
      k >= 0 && k < subtype.length - 1 ? subtype.slice(k + 1) : null,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { contentType: "application/problem+json" },
  output: {
    result: { mediaType: "application/problem+json", structuredSuffix: "json" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-media-type-structured-suffix",
  title: "HTTP Media Type Structured Suffix",
  description:
    "Extract the final structured subtype suffix after validating the complete Content-Type through the existing parser; no IANA registration claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
