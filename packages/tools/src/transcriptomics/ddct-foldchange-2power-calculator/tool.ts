import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ deltaDeltaCt: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "deltaDeltaCt", label: "Delta delta ct", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    conditionalFoldChange: 2 ** -i.deltaDeltaCt,
    assumption: "equal-100-percent-PCR-efficiency",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { deltaDeltaCt: -2 },
  output: {
    result: {
      conditionalFoldChange: 4,
      assumption: "equal-100-percent-PCR-efficiency",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/ddct-foldchange-2power-calculator",
  title: "Delta-Delta-Ct Fold Change 2^-ddCt Calculator",
  description:
    "Compute 2^(−ΔΔCt) from an independently normalized ΔΔCt under equal 100-percent amplification efficiency; no reference-gene selection or raw Ct normalization.",
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
