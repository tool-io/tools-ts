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
  const c = H.localCandidates(s, i.local);
  return H.finish({
    classification:
      c.length === 0
        ? "gap-or-uncovered"
        : c.length === 1
          ? "unique"
          : "ambiguous",
    candidates: c,
  });
};
export const example = {
  input: {
    spansJson:
      '[{"start": 0, "end": 10, "offset": 0}, {"start": 10, "end": 20, "offset": 2}, {"start": 20, "end": 30, "offset": 0}]',
    local: 11,
  },
  output: { result: { classification: "gap-or-uncovered", candidates: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Time Zone Local Ambiguity Classifier",
      "time zones",
      "UTC offsets",
    ],
    collections: ["data", "learn"],
    fields: ["zone", "time zones", "UTC offsets"],
    keywords: ["time zones", "UTC offsets"],
  },
  id: "zone/offset-local-ambiguity-classifier",
  title: "Time Zone Local Ambiguity Classifier",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; classify supplied local candidates without claiming missing evidence proves a real civil-clock gap; repeated/overlapping observations remain ambiguous.",
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
          classification: { type: "string" },
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
        required: ["classification", "candidates"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
