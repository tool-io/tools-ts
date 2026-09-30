import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ start: number; stop: number; step: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", label: "Start", kind: "integer" },
  { id: "stop", label: "Stop", kind: "integer" },
  { id: "step", label: "Step", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.start, i.stop].forEach((x) => H.int(x, -1000000000, 1000000000));
  H.int(i.step, -1000000, 1000000);
  H.check(i.step !== 0);
  return H.finish({
    direction: i.step > 0 ? "forward" : "backward",
    nonempty: i.step > 0 ? i.start < i.stop : i.start > i.stop,
    count: Math.max(0, Math.ceil((i.stop - i.start) / i.step)),
  });
};
export const example = {
  input: { start: 5, stop: 0, step: -2 },
  output: { result: { direction: "backward", nonempty: true, count: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-slice-step-direction-check",
  title: "List: List Slice Step Direction Check Tool",
  description:
    "Check direction and length of an already normalized signed-step half-open index range; no Python negative-index normalization or element allocation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "number" },
          direction: { type: "string" },
          nonempty: { type: "boolean" },
        },
        required: ["count", "direction", "nonempty"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
