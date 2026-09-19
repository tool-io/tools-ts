import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  low: number;
  high: number;
  runs: number;
  minimum: number;
  maximum: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "low", label: "low", kind: "number" },
  { id: "high", label: "high", kind: "number" },
  { id: "runs", label: "runs", kind: "integer" },
  { id: "minimum", label: "minimum", kind: "integer" },
  { id: "maximum", label: "maximum", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.check(i.low !== i.high);
  H.int(i.runs, 1, 128);
  H.int(i.minimum, 1, 128);
  H.int(i.maximum, i.minimum, 128);
  H.check(i.runs * i.maximum <= 128);
  const initialHigh = H.randint(0, 1, random) === 1,
    lengths = Array.from({ length: i.runs }, () =>
      H.randint(i.minimum, i.maximum, random),
    );
  return H.finish({
    seed: i.seed,
    initialHigh,
    runs: lengths.map((length, j) => ({
      value: (j % 2 === 0) === initialHigh ? i.high : i.low,
      length,
    })),
    values: lengths.flatMap((length, j) =>
      Array(length).fill((j % 2 === 0) === initialHigh ? i.high : i.low),
    ),
  });
};
export const example = {
  input: { low: 0, high: 1, runs: 3, minimum: 1, maximum: 2, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      initialHigh: false,
      runs: [
        { value: 0, length: 1 },
        { value: 1, length: 1 },
        { value: 0, length: 1 },
      ],
      values: [0, 1, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/two-level-run-trace",
  title: "Random Two-Level Run Trace",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose a fair initial level and independent uniform run lengths, then alternate two explicit distinct levels; support is level/run assignments, not uniform over all bounded traces.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
