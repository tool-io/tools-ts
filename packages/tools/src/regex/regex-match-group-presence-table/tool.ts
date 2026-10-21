import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ groupsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "groupsJson", kind: "string", label: "groupsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.arr(i.groupsJson).map((v) => {
    H.check(Array.isArray(v));
    return (v as unknown[]).map((x) => {
      H.check(x === null || typeof x === "string");
      return x;
    });
  });
  return H.finish({ presence: r.map((v) => v.map((x) => x !== null)) });
};
export const example = {
  input: { groupsJson: '[["",null,"a"],[null,"b"]]' },
  output: {
    result: {
      presence: [
        [true, false, true],
        [false, true],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/regex-match-group-presence-table",
  title: "Regex Match Group Presence Table",
  description:
    "Report explicit JSON match-group presence where null means unmatched and empty string means a present empty capture; ragged match groups are retained.",
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
          presence: {
            type: "array",
            items: { type: "array", items: { type: "boolean" } },
          },
        },
        required: ["presence"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
