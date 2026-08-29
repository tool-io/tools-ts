import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { deltas: [3, 4, -1] },
  output: { values: [3, 7, 6] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "decode/delta",
  title: "Delta Decoder",
  description:
    "Reconstruct a numeric sequence from a first value and successive differences; floating-point rounding may appear in non-integer inputs.",
  inputs: [{ id: "deltas", kind: "numberList", label: "deltas" }],
  outputs: [{ id: "values", kind: "numberList", label: "values" }],
  calculate: (input) => {
    let total = 0;
    const values = (input.deltas as number[]).map((delta) => {
      total += delta;
      if (!Number.isFinite(total))
        simpleError("deltas", "Cumulative value overflows.");
      return total;
    });
    return { values };
  },
});
export type DeltaInput = Readonly<typeof example.input>;
export type DeltaOutput = Readonly<typeof example.output>;
export const deltaTool = tool;
export const runDelta = tool.execute;
export default tool;
