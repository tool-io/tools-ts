import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ t: number; delay: number; end: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "t", label: "t", kind: "number" },
  { id: "delay", label: "delay", kind: "number" },
  { id: "end", label: "end", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.end > i.delay);
  return H.finish({
    progress: Math.max(0, Math.min(1, (i.t - i.delay) / (i.end - i.delay))),
  });
};
export const example = {
  input: { t: 0.5, delay: 0.25, end: 0.75 },
  output: { result: { progress: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Unit Progress Delay Remap", "mathematics"],
    collections: ["data", "learn"],
    fields: ["easing", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "easing/unit-progress-delay-remap",
  title: "Unit Progress Delay Remap",
  description:
    "Remap an explicit progress interval into a clamped unit interval; delay/end are finite ordered coordinates, not a scheduler.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { progress: { type: "number" } },
        required: ["progress"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
