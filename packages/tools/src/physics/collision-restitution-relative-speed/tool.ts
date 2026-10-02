import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ approachSpeed: number; restitution: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "approachSpeed", label: "Approach speed", kind: "number" },
  { id: "restitution", label: "Restitution", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.approachSpeed >= 0);
  H.bounded(i.restitution, 0, 1);
  return H.finish({ separationSpeed: i.approachSpeed * i.restitution });
};
export const example = {
  input: { approachSpeed: 5, restitution: 0.8 },
  output: { result: { separationSpeed: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "physics/collision-restitution-relative-speed",
  title: "Physics: Collision Restitution Relative Speed Tool",
  description:
    "Apply the normal coefficient-of-restitution relation to a nonnegative approach speed under an explicitly passive 0..1 restitution model; not a collision impulse solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { separationSpeed: { type: "number" } },
        required: ["separationSpeed"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
