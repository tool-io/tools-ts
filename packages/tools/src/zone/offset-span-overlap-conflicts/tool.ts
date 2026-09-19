import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ spansJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "spansJson", label: "spansJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const s = H.zoneSpans(i.spansJson);
  return H.finish({
    conflicts: s.flatMap((a, j) =>
      s.slice(j + 1).flatMap((b, k) => {
        const start = Math.max(a.start, b.start),
          end = Math.min(a.end, b.end);
        return start < end && a.offset !== b.offset
          ? [
              {
                left: j,
                right: j + 1 + k,
                start,
                end,
                leftOffset: a.offset,
                rightOffset: b.offset,
              },
            ]
          : [];
      }),
    ),
  });
};
export const example = {
  input: {
    spansJson:
      '[{"start":0,"end":2,"offset":0},{"start":1,"end":3,"offset":2}]',
  },
  output: {
    result: {
      conflicts: [
        { left: 0, right: 1, start: 1, end: 2, leftOffset: 0, rightOffset: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-span-overlap-conflicts",
  title: "Time Zone Offset Span Overlap Conflicts",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; report every positive-length UTC span overlap with unequal offset evidence; touching or identical offsets are not conflicts. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
