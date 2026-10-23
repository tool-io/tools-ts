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
    markers: t.map((v, index) => ({
      index,
      utc: v.at,
      localBefore: v.at + v.before,
      localAfter: v.at + v.after,
      kind:
        v.after > v.before ? "gap" : v.after < v.before ? "fold" : "unchanged",
    })),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"at": 10, "before": 0, "after": 2}, {"at": 20, "before": 2, "after": 0}]',
  },
  output: {
    result: {
      markers: [
        { index: 0, utc: 10, localBefore: 10, localAfter: 12, kind: "gap" },
        { index: 1, utc: 20, localBefore: 22, localAfter: 20, kind: "fold" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Time Zone Transition Calendar Marker Table",
      "time zones",
      "UTC offsets",
    ],
    collections: ["data", "learn"],
    fields: ["zone", "time zones", "UTC offsets"],
    keywords: ["time zones", "UTC offsets"],
  },
  id: "zone/offset-transition-calendar-marker-table",
  title: "Time Zone Transition Calendar Marker Table",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; produce numeric transition calendar marker coordinates on both sides of each jump; no actual Gregorian dates or formatting implied.",
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
          markers: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                utc: { type: "number" },
                localBefore: { type: "number" },
                localAfter: { type: "number" },
                kind: { type: "string" },
              },
              required: ["index", "utc", "localBefore", "localAfter", "kind"],
            },
          },
        },
        required: ["markers"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
