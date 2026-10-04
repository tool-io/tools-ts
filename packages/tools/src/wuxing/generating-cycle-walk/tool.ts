import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  startPhase: string;
  count: number;
  direction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "startPhase", label: "Start phase", kind: "string" },
  { id: "count", label: "Count", kind: "integer" },
  { id: "direction", label: "Direction", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const phases = ["wood", "fire", "earth", "metal", "water"];
  H.choice(i.startPhase, phases);
  H.int(i.count, 1, 32);
  H.check(i.direction === 1 || i.direction === -1);
  return H.finish({
    phases: Array.from(
      { length: i.count },
      (_, j) =>
        phases[H.mod(phases.indexOf(i.startPhase) + j * i.direction * 1, 5)],
    ),
  });
};
export const example = {
  input: { startPhase: "wood", count: 3, direction: 1 },
  output: { result: { phases: ["wood", "fire", "earth"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "wuxing/generating-cycle-walk",
  title: "Wuxing Generating-Cycle Sequence Builder",
  description:
    "Walk the conventional generating Wuxing cycle with explicit direction and count, including the starting phase; symbolic sequence only.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { phases: { type: "array", items: { type: "string" } } },
        required: ["phases"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
