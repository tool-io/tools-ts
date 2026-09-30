import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ containerKind: string; token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "containerKind",
    label: "Container kind",
    kind: "string",
    enum: ["object", "array"],
  },
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.containerKind, ["object", "array"]);
  const canonical = /^(?:0|[1-9]\d{0,8})(?![\s\S])/.test(i.token);
  return H.finish({
    interpretation:
      i.containerKind === "object"
        ? "member-name"
        : i.token === "-"
          ? "append-position"
          : canonical
            ? "array-index"
            : "invalid-array-index",
    index: i.containerKind === "array" && canonical ? Number(i.token) : -1,
  });
};
export const example = {
  input: { containerKind: "object", token: "01" },
  output: { result: { interpretation: "member-name", index: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-pointer-numeric-key-vs-index",
  title: "JSON: JSON Pointer Numeric Key Vs Index Tool",
  description:
    "Interpret an already decoded JSON Pointer token only under an explicit object/array container context; hyphen is an append position only for a write operation.",
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
          index: { type: "number" },
          interpretation: { type: "string" },
        },
        required: ["index", "interpretation"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
