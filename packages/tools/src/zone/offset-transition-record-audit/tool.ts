import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ transitionsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.zoneTransitions(i.transitionsJson);
  return H.finish({
    duplicateInstants: H.duplicates(t, (v) => String(v.at)),
    nonIncreasing: t.flatMap((v, j) => (j && v.at <= t[j - 1].at ? [j] : [])),
    discontinuous: t.flatMap((v, j) =>
      j && v.before !== t[j - 1].after ? [j] : [],
    ),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"at": 10, "before": 0, "after": 2}, {"at": 20, "before": 2, "after": 0}]',
  },
  output: {
    result: { duplicateInstants: [], nonIncreasing: [], discontinuous: [] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Time Zone Offset Transition Record Audit",
      "time zones",
      "UTC offsets",
    ],
    collections: ["data", "learn"],
    fields: ["zone", "time zones", "UTC offsets"],
    keywords: ["time zones", "UTC offsets"],
  },
  id: "zone/offset-transition-record-audit",
  title: "Time Zone Offset Transition Record Audit",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; audit transition chronological order, duplicate instants and adjacent before/after offset continuity without sorting or repairing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          duplicateInstants: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
          nonIncreasing: { type: "array", items: { type: "number" } },
          discontinuous: { type: "array", items: { type: "number" } },
        },
        required: ["duplicateInstants", "nonIncreasing", "discontinuous"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
