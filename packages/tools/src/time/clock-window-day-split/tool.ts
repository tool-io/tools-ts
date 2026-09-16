import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ windowsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "windowsJson", kind: "string", label: "windowsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ segments: H.clockSpans(i.windowsJson) });
};
export const example = {
  input: { windowsJson: "[[80000,100],[50,200]]" },
  output: {
    result: {
      segments: [
        [80000, 86400],
        [0, 100],
        [50, 200],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/clock-window-day-split",
  title: "Clock Window Day Splitter",
  description:
    "Split each ordinary or overnight half-open civil clock window into same-day segments; no time-zone inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
