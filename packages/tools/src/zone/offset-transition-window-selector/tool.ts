import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  start: number;
  end: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "start", label: "start", kind: "number" },
  { id: "end", label: "end", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.zoneTransitions(i.transitionsJson);
  H.check(i.start <= i.end);
  return H.finish({
    transitions: t.flatMap((v, index) =>
      v.at >= i.start && v.at < i.end ? [{ ...v, index }] : [],
    ),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"at": 10, "before": 0, "after": 2}, {"at": 20, "before": 2, "after": 0}]',
    start: 10,
    end: 20,
  },
  output: {
    result: { transitions: [{ at: 10, before: 0, after: 2, index: 0 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-transition-window-selector",
  title: "Time Zone Transition Window Selector",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; select transition occurrence records inside a half-open UTC window without sorting or deduplicating. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
