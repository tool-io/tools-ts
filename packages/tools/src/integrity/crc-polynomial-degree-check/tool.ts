import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ polynomial: string; declaredDegree: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "polynomial", kind: "string", label: "polynomial" },
  { id: "declaredDegree", kind: "integer", label: "declaredDegree" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.declaredDegree, 1, 128);
  const p = H.bigint(i.polynomial);
  H.check(p > 0n);
  const degree = p.toString(2).length - 1;
  return H.finish({
    degree,
    matches: degree === i.declaredDegree,
    hasConstant: p % 2n === 1n,
  });
};
export const example = {
  input: { polynomial: "19", declaredDegree: 4 },
  output: { result: { degree: 4, matches: true, hasConstant: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/crc-polynomial-degree-check",
  title: "CRC Polynomial Degree Check",
  description:
    "Audit the degree and constant coefficient of a full CRC GF(2) polynomial integer including its leading coefficient; not an omitted-leading-bit parameter.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: { type: "number" },
          matches: { type: "boolean" },
          hasConstant: { type: "boolean" },
        },
        required: ["degree", "matches", "hasConstant"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
