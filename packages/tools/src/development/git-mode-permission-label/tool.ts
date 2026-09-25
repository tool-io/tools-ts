import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ mode: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "mode",
    label: "Mode",
    kind: "string",
    enum: ["100644", "100755", "120000", "160000", "040000"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.mode, ["100644", "100755", "120000", "160000", "040000"]);
  return H.finish({
    kind: (
      {
        "100644": "regular",
        "100755": "executable",
        "120000": "symlink",
        "160000": "gitlink",
        "040000": "tree",
      } as Record<string, string>
    )[i.mode],
  });
};
export const example = {
  input: { mode: "100755" },
  output: { result: { kind: "executable" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/git-mode-permission-label",
  title: "Development: Git Mode Permission Label Tool",
  description:
    "Label a documented Git index/tree mode token without pretending it is a complete Unix permission mask.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { kind: { type: "string" } },
        required: ["kind"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
