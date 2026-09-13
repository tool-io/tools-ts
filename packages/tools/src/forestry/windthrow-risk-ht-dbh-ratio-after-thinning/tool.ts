import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedTreeHeightMeters: number;
  readonly actualObservedDbhCentimeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedTreeHeightMeters",
    label: "Actual observed tree height meters",
    kind: "number",
  },
  {
    id: "actualObservedDbhCentimeters",
    label: "Actual observed dbh centimeters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.actualObservedTreeHeightMeters,
    "actualObservedTreeHeightMeters",
  );
  positive(input.actualObservedDbhCentimeters, "actualObservedDbhCentimeters");
  return {
    value:
      (100 * input.actualObservedTreeHeightMeters) /
      input.actualObservedDbhCentimeters,
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
  input: {
    actualObservedTreeHeightMeters: 20,
    actualObservedDbhCentimeters: 40,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/windthrow-risk-ht-dbh-ratio-after-thinning",
  title: "Post-Thinning Windthrow ht/dbh Risk Ratio",
  description:
    "Observedtree-slendernessH/DBHafterthinning,matchedunits convertedcm/cm,not windthrowprobability/safety. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
