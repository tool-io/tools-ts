import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ leftJson: string; rightJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftJson", label: "leftJson", kind: "string" },
  { id: "rightJson", label: "rightJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.zoneSpans(i.leftJson),
    b = H.zoneSpans(i.rightJson);
  return H.finish({
    pieces: a.flatMap((left, j) =>
      b.flatMap((right, k) => {
        const start = Math.max(left.start, right.start),
          end = Math.min(left.end, right.end);
        return start < end
          ? [
              {
                left: j,
                right: k,
                start,
                end,
                difference: right.offset - left.offset,
              },
            ]
          : [];
      }),
    ),
  });
};
export const example = {
  input: {
    leftJson: '[{"start":0,"end":2,"offset":1}]',
    rightJson: '[{"start":1,"end":3,"offset":4}]',
  },
  output: {
    result: {
      pieces: [{ left: 0, right: 0, start: 1, end: 2, difference: 3 }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-zone-pair-difference-table",
  title: "Time Zone Pair Offset Difference Table",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; compare simultaneous supplied zone-span offsets only on explicit UTC intersections, preserving signed right-minus-left and every overlap occurrence. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
