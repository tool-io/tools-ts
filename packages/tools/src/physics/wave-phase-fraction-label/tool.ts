import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ phaseCycles: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "phaseCycles", label: "Phase cycles", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.phaseCycles, -1e9, 1e9);
  return H.finish({
    fractionalCycle: H.mod(i.phaseCycles, 1),
    phaseDegrees: 360 * H.mod(i.phaseCycles, 1),
    completeCycles: Math.floor(i.phaseCycles),
  });
};
export const example = {
  input: { phaseCycles: -0.25 },
  output: {
    result: { fractionalCycle: 0.75, phaseDegrees: 270, completeCycles: -1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "physics/wave-phase-fraction-label",
  title: "Physics: Wave Phase Fraction Label Tool",
  description:
    "Decompose a signed wave phase in cycles into floor-based complete cycles and a nonnegative within-cycle phase, not a wave propagation model.",
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
          completeCycles: { type: "number" },
          fractionalCycle: { type: "number" },
          phaseDegrees: { type: "number" },
        },
        required: ["completeCycles", "fractionalCycle", "phaseDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
