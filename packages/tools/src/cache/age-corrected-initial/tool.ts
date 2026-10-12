import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  requestTime: number;
  responseTime: number;
  dateValue: number;
  ageValue: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "requestTime", label: "requestTime", kind: "number" },
  { id: "responseTime", label: "responseTime", kind: "number" },
  { id: "dateValue", label: "dateValue", kind: "number" },
  { id: "ageValue", label: "ageValue", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.responseTime >= i.requestTime && i.ageValue >= 0);
  const apparent = Math.max(0, i.responseTime - i.dateValue),
    corrected = i.ageValue + i.responseTime - i.requestTime;
  return H.finish({
    apparentAge: apparent,
    correctedAgeValue: corrected,
    correctedInitialAge: Math.max(apparent, corrected),
  });
};
export const example = {
  input: { requestTime: 10, responseTime: 12, dateValue: 5, ageValue: 3 },
  output: {
    result: { apparentAge: 7, correctedAgeValue: 5, correctedInitialAge: 7 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Cache Corrected Initial Age", "caching", "software development"],
    collections: ["data", "learn"],
    fields: ["cache", "caching", "software development"],
    keywords: ["caching", "software development"],
  },
  id: "cache/age-corrected-initial",
  title: "Cache Corrected Initial Age",
  description:
    "Compute RFC 9111 corrected initial cache age from explicit same-unit timestamps and Age value; no actual network observation or clock synchronization assumed.",
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
          apparentAge: { type: "number" },
          correctedAgeValue: { type: "number" },
          correctedInitialAge: { type: "number" },
        },
        required: ["apparentAge", "correctedAgeValue", "correctedInitialAge"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
