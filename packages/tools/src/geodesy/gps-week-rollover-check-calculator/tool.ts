import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  broadcastWeek: number;
  referenceFullWeek: number;
  bits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "broadcastWeek", label: "Broadcast week", kind: "integer" },
  { id: "referenceFullWeek", label: "Reference full week", kind: "integer" },
  { id: "bits", label: "Bits", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 1, 16);
  const period = 2 ** i.bits;
  H.int(i.broadcastWeek, 0, period - 1);
  H.int(i.referenceFullWeek, 0, 1e7);
  const k = Math.round((i.referenceFullWeek - i.broadcastWeek) / period),
    resolved = i.broadcastWeek + k * period;
  H.check(
    resolved >= 0 && Math.abs(resolved - i.referenceFullWeek) < period / 2,
    "Reference is exactly ambiguous at a half rollover or outside nonnegative eras",
  );
  return H.finish({
    resolvedFullWeek: resolved,
    era: Math.floor(resolved / period),
    differenceFromReferenceWeeks: resolved - i.referenceFullWeek,
    ambiguous: false,
  });
};
export const example = {
  input: { broadcastWeek: 0, referenceFullWeek: 2048, bits: 10 },
  output: {
    result: {
      resolvedFullWeek: 2048,
      era: 2,
      differenceFromReferenceWeeks: 0,
      ambiguous: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/gps-week-rollover-check-calculator",
  title: "GPS Week Number rollover Check Calculator",
  description:
    "Resolve a modulo GPS broadcast week only when a unique nonnegative full week lies within half a rollover of a caller reference; ties/out-of-window eras reject, with no current-clock or UTC inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
