import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ dotMask: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dotMask", label: "Dot mask", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.dotMask, 0, 255);
  return H.finish({
    character: String.fromCodePoint(0x2800 + i.dotMask),
    raisedDots: Array.from({ length: 8 }, (_, j) => j + 1).filter(
      (j) => Math.floor(i.dotMask / 2 ** (j - 1)) % 2 === 1,
    ),
  });
};
export const example = {
  input: { dotMask: 9 },
  output: { result: { character: "\u2809", raisedDots: [1, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "disability-studies/braille-single-cell-dot-mask-label",
  title: "Disability Studies: Braille Single Cell Dot Mask Label Tool",
  description:
    "Render and label one eight-dot Unicode Braille cell from its dot mask, with dot1 as bit0; no language-specific braille transcription.",
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
          character: { type: "string" },
          raisedDots: { type: "array", items: { type: "number" } },
        },
        required: ["character", "raisedDots"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
