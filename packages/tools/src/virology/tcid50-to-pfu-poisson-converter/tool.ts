import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch53-shared.js";

export type Input = Readonly<{ tcid50Units: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tcid50Units", label: "Tcid50 units", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.tcid50Units, "units");
  return {
    conditionalPfu: i.tcid50Units * Math.LN2,
    assumption: "ideal-single-hit-Poisson",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { tcid50Units: 100 },
  output: {
    result: {
      conditionalPfu: 69.31471805599453,
      assumption: "ideal-single-hit-Poisson",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/tcid50-to-pfu-poisson-converter",
  title: "TCID50 to PFU Approximate Poisson Converter (0.69 factor)",
  description:
    "Convert TCID50 units using ln(2), not an empirically universal PFU calibration; assumes an ideal single-hit Poisson endpoint assay.",
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
