import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  existingKey: number;
  incomingKey: number;
  equalPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "existingKey", label: "Existing key", kind: "number" },
  { id: "incomingKey", label: "Incoming key", kind: "number" },
  {
    id: "equalPolicy",
    label: "Equal policy",
    kind: "string",
    enum: ["before", "after"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.equalPolicy, ["before", "after"]);
  return H.finish({
    insertBefore:
      i.incomingKey < i.existingKey ||
      (i.incomingKey === i.existingKey && i.equalPolicy === "before"),
    equal: i.incomingKey === i.existingKey,
  });
};
export const example = {
  input: { existingKey: 2, incomingKey: 2, equalPolicy: "after" },
  output: { result: { insertBefore: false, equal: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-insertion-side-tie-policy",
  title: "List: List Insertion Side Tie Policy Tool",
  description:
    "Resolve one sorted ascending insertion comparison with an explicit before/after equal-key policy, not a sorting algorithm.",
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
          equal: { type: "boolean" },
          insertBefore: { type: "boolean" },
        },
        required: ["equal", "insertBefore"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
