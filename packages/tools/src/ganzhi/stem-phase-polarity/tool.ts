import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ stemIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "stemIndex", label: "Stem index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.stemIndex, 0, 9);
  return H.finish({
    phase: ["wood", "fire", "earth", "metal", "water"][
      Math.floor(i.stemIndex / 2)
    ],
    polarity: i.stemIndex % 2 === 0 ? "yang" : "yin",
  });
};
export const example = {
  input: { stemIndex: 0 },
  output: { result: { phase: "wood", polarity: "yang" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ganzhi/stem-phase-polarity",
  title: "Heavenly Stem Phase and Polarity Lookup",
  description:
    "Map zero-based Jia through Gui stems to the conventional five phases and alternating yang/yin labels; no personality or causal inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { phase: { type: "string" }, polarity: { type: "string" } },
        required: ["phase", "polarity"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
