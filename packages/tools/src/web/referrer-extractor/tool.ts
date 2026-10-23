import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  absoluteUrl,
} from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualRawRequestHeaderLines: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualRawRequestHeaderLines",
    label: "Actual raw request header lines",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  const a = input.actualRawRequestHeaderLines
    .split(/\r?\n/)
    .filter((v) => /^referer:/i.test(v));
  if (a.length > 1)
    simpleError("Referer", "DuplicateactualRefererfieldsambiguous.");
  if (!a.length)
    return { observedRefererPresent: false, observedRefererUrl: "" };
  const value = a[0].slice(a[0].indexOf(":") + 1).trim();
  const url = absoluteUrl(value);
  if (!["http:", "https:"].includes(url.protocol))
    simpleError("Referer", "DeclaredabsoluteHTTP(S)Refererbranch.");
  return { observedRefererPresent: true, observedRefererUrl: url.href };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRawRequestHeaderLines:
      "Host: example.com\nReferer: https://source.example/path",
  },
  output: {
    result: {
      observedRefererPresent: true,
      observedRefererUrl: "https://source.example/path",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/referrer-extractor",
  title: "Referrer Extractor",
  description:
    "ExtractactualRefererfieldfrom supplied raw request header lines only; singleabsoluteHTTP(S) branch, no fetch, Referrer-Policy decision or trust/authenticity inferred from spoof able header.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedRefererPresent: { type: "boolean" },
          observedRefererUrl: { type: "string" },
        },
        required: ["observedRefererPresent", "observedRefererUrl"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
