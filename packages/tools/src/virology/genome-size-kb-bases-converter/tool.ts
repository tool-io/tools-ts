import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
} from "../batch53-shared.js";

export type Input = Readonly<{ segmentSizesKb: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "segmentSizesKb", label: "Segment sizes kb", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.segmentSizesKb.length) simpleError("segments", "Explicit segments.");
  i.segmentSizesKb.forEach((v) => positive(v, "kb"));
  return {
    segmentCount: i.segmentSizesKb.length,
    segmentSizesBases: i.segmentSizesKb.map((v) => v * 1000),
    totalBases: sum(i.segmentSizesKb) * 1000,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { segmentSizesKb: [1, 2] },
  output: {
    result: {
      segmentCount: 2,
      segmentSizesBases: [1000, 2000],
      totalBases: 3000,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/genome-size-kb-bases-converter",
  title: "Genome Size kb to Bases Converter with Segment Counter",
  description:
    "Convert explicit segmented viral genome lengths using decimal kilobases and retain segment count; not kilobytes or an inferred segment structure.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
