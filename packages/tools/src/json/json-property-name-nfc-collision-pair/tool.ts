import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ first: string; second: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "first", label: "First", kind: "string" },
  { id: "second", label: "Second", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = i.first.normalize("NFC"),
    b = i.second.normalize("NFC");
  return H.finish({
    exactEqual: i.first === i.second,
    nfcEqual: a === b,
    normalizationCollision: i.first !== i.second && a === b,
  });
};
export const example = {
  input: { first: "\u00e9", second: "e\u0301" },
  output: {
    result: { exactEqual: false, nfcEqual: true, normalizationCollision: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-property-name-nfc-collision-pair",
  title: "JSON: JSON Property Name Nfc Collision Pair Tool",
  description:
    "Compare two potential JSON member names for NFC normalization collisions without normalizing or rewriting any object.",
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
          exactEqual: { type: "boolean" },
          nfcEqual: { type: "boolean" },
          normalizationCollision: { type: "boolean" },
        },
        required: ["exactEqual", "nfcEqual", "normalizationCollision"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
