import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ spansJson: string; local: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "spansJson", label: "spansJson", kind: "string" },
  { id: "local", label: "local", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const s = H.zoneSpans(i.spansJson);
  H.check(Math.abs(i.local) <= 1e12);
  return H.finish({ candidates: H.localCandidates(s, i.local) });
};
export const example = {
  input: {
    spansJson:
      '[{"start": 0, "end": 10, "offset": 0}, {"start": 10, "end": 20, "offset": 2}, {"start": 20, "end": 30, "offset": 0}]',
    local: 21,
  },
  output: {
    result: {
      candidates: [
        { index: 1, utc: 19, offset: 2 },
        { index: 2, utc: 21, offset: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Time Zone Local UTC Candidate List",
      "time zones",
      "UTC offsets",
    ],
    collections: ["data", "learn"],
    fields: ["zone", "time zones", "UTC offsets"],
    keywords: ["time zones", "UTC offsets"],
  },
  id: "zone/offset-local-utc-candidate-list",
  title: "Time Zone Local UTC Candidate List",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; enumerate every offset-span UTC solution for a supplied local-second coordinate, retaining duplicates and overlapping evidence.",
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
          candidates: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                utc: { type: "number" },
                offset: { type: "number" },
              },
              required: ["index", "utc", "offset"],
            },
          },
        },
        required: ["candidates"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
