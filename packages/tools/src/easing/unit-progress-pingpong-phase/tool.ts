import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ progress: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "progress", label: "progress", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const phase = H.mod(i.progress, 2);
  return H.finish({
    phase: phase <= 1 ? phase : 2 - phase,
    direction: phase < 1 ? 1 : -1,
  });
};
export const example = {
  input: { progress: 1.25 },
  output: { result: { phase: 0.75, direction: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "easing/unit-progress-pingpong-phase",
  title: "Unit Progress Ping Pong Phase",
  description:
    "Map signed continuous progress to a triangular ping-pong phase with period two and explicit branch direction; turning points use the outgoing branch.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
