import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, positive } from "../batch53-shared.js";

export type Input = Readonly<{
  parasitesCounted: number;
  wbcCounted: number;
  measuredWbcPerMicrolitre: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parasitesCounted", label: "Parasites counted", kind: "number" },
  { id: "wbcCounted", label: "Wbc counted", kind: "number" },
  {
    id: "measuredWbcPerMicrolitre",
    label: "Measured wbc per microlitre",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.parasitesCounted, "parasites", 0, 1e9);
  positive(i.wbcCounted, "counted-wbc");
  positive(i.measuredWbcPerMicrolitre, "measured-wbc");
  return {
    conditionalParasitesPerMicrolitre:
      (i.parasitesCounted / i.wbcCounted) * i.measuredWbcPerMicrolitre,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    parasitesCounted: 10,
    wbcCounted: 200,
    measuredWbcPerMicrolitre: 6000,
  },
  output: { result: { conditionalParasitesPerMicrolitre: 300 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/parasitemia-per-microlitre-conversion-calculator",
  title:
    "Malaria Parasitemia per microlitre Conversion from WBC Count Calculator",
  description:
    "Estimate parasite density using independently measured WBC/µL, not an invented default leukocyte count or a diagnosis.",
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
