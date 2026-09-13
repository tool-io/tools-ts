import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualResidualBasalAreaSquareYardsPerAcre: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualResidualBasalAreaSquareYardsPerAcre",
    label: "Actual residual basal area square yards per acre",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualResidualBasalAreaSquareYardsPerAcre,
    "actualResidualBasalAreaSquareYardsPerAcre",
  );
  return {
    value:
      (input.actualResidualBasalAreaSquareYardsPerAcre * 0.83612736) /
      0.40468564224,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualResidualBasalAreaSquareYardsPerAcre: 1 },
  output: { result: { value: 2.066115702479339 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/thinning-yards-per-acre-residual-basal-area",
  title: "Thinning Residual Basal Area Yards/Acre Converter",
  description:
    "Exactyard\u00b2/acre to m\u00b2/ha basalareaunitconversion,not thinningrecommendation. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
