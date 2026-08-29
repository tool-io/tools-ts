import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { values: [3, 7, 6] },
  output: { deltas: [3, 4, -1] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "encode/delta",
  title: "Delta Encoder",
  description:
    "Encode a numeric sequence as its first value followed by successive differences, preserving exact numeric values within finite floating-point arithmetic.",
  inputs: [{ id: "values", kind: "numberList", label: "values" }],
  outputs: [{ id: "deltas", kind: "numberList", label: "deltas" }],
  calculate: (input) => {
    const values = input.values as number[];
    return {
      deltas: values.map((value, i) =>
        i === 0 ? value : value - values[i - 1]!,
      ),
    };
  },
});
export type DeltaInput = Readonly<typeof example.input>;
export type DeltaOutput = Readonly<typeof example.output>;
export const deltaTool = tool;
export const runDelta = tool.execute;
export default tool;
