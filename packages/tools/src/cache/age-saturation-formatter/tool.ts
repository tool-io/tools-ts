import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ age: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "age", label: "age", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const age = H.bigint(i.age),
    limit = 2147483648n;
  H.check(age >= 0n);
  return H.finish({
    value: String(age > limit ? limit : age),
    saturated: age > limit,
  });
};
export const example = {
  input: { age: "9007199254740993" },
  output: { result: { value: "2147483648", saturated: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Cache Age Saturation Formatter",
      "caching",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["cache", "caching", "software development"],
    keywords: ["caching", "software development"],
  },
  id: "cache/age-saturation-formatter",
  title: "Cache Age Saturation Formatter",
  description:
    "Format a nonnegative exact cache Age integer with RFC delta-seconds overflow saturation at 2^31; does not read response timing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "string" },
          saturated: { type: "boolean" },
        },
        required: ["value", "saturated"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
