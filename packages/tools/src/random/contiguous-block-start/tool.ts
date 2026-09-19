import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  length: number;
  blockLength: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", label: "length", kind: "integer" },
  { id: "blockLength", label: "blockLength", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.length, 1, 128);
  H.int(i.blockLength, 1, i.length);
  const start = H.randint(0, i.length - i.blockLength, random);
  return H.finish({ seed: i.seed, start, end: start + i.blockLength });
};
export const example = {
  input: { length: 5, blockLength: 2, seed: "batch56" },
  output: { result: { seed: "batch56", start: 0, end: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/contiguous-block-start",
  title: "Random Contiguous Block Start",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose one uniform legal contiguous block start in a finite index domain; positive block length cannot exceed domain size.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
