import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ lowerCode: number; upperCode: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lowerCode", label: "Lower code", kind: "integer" },
  { id: "upperCode", label: "Upper code", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.lowerCode, 0, 7);
  H.int(i.upperCode, 0, 7);
  const code = i.lowerCode + 8 * i.upperCode;
  return H.finish({
    code,
    lines: Array.from({ length: 6 }, (_, j) => Math.floor(code / 2 ** j) % 2),
  });
};
export const example = {
  input: { lowerCode: 1, upperCode: 2 },
  output: { result: { code: 17, lines: [1, 0, 0, 0, 1, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "yijing/trigram-pair-composer",
  title: "Yijing Upper and Lower Trigram Composer",
  description:
    "Compose explicit binary trigram codes, lower first, into six bottom-to-top lines; uses binary identities rather than a guessed King Wen table.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          code: { type: "number" },
          lines: { type: "array", items: { type: "number" } },
        },
        required: ["code", "lines"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
