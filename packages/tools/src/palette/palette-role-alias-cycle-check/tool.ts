import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ aliasesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "aliasesJson", kind: "string", label: "aliasesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const m = H.aliases(i.aliasesJson);
  return H.finish({
    cyclicNames: [...m.keys()].filter((x) => H.resolveAlias(m, x).cycle),
  });
};
export const example = {
  input: {
    aliasesJson: '[{"name":"a","target":"b"},{"name":"b","target":"a"}]',
  },
  output: { result: { cyclicNames: ["a", "b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-role-alias-cycle-check",
  title: "Palette Role Alias Cycle Check",
  description:
    "Find supplied palette role aliases whose resolution enters a cycle, including aliases leading into that cycle; does not invent terminal roles.",
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
          cyclicNames: { type: "array", items: { type: "string" } },
        },
        required: ["cyclicNames"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
