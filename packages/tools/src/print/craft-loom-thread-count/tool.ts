import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  width: number;
  threadsPerUnit: number;
  edgeThreads: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", kind: "number", label: "width" },
  { id: "threadsPerUnit", kind: "number", label: "threadsPerUnit" },
  { id: "edgeThreads", kind: "integer", label: "edgeThreads" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.width >= 0);
  H.positive(i.threadsPerUnit);
  H.int(i.edgeThreads);
  return H.finish({
    bodyThreads: Math.ceil(i.width * i.threadsPerUnit),
    totalThreads: Math.ceil(i.width * i.threadsPerUnit) + i.edgeThreads,
  });
};
export const example = {
  input: { width: 3, threadsPerUnit: 2.5, edgeThreads: 4 },
  output: { result: { bodyThreads: 8, totalThreads: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/craft-loom-thread-count",
  title: "Craft Loom Thread Count",
  description:
    "Budget whole loom warp threads from explicit width and sett, rounding body threads up and adding a total edge allowance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
