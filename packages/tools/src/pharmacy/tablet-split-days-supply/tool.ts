import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualWholeTabletInventory: number;
  readonly callerProductQualifiedPiecesPerTablet: number;
  readonly callerClinicianOrderedPiecesPerDay: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualWholeTabletInventory",
    label: "Actual whole tablet inventory",
    kind: "number",
  },
  {
    id: "callerProductQualifiedPiecesPerTablet",
    label: "Caller product qualified pieces per tablet",
    kind: "number",
  },
  {
    id: "callerClinicianOrderedPiecesPerDay",
    label: "Caller clinician ordered pieces per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualWholeTabletInventory,
    "actualWholeTabletInventory",
    0,
    1000000,
  );
  bounded(
    input.callerProductQualifiedPiecesPerTablet,
    "callerProductQualifiedPiecesPerTablet",
    1,
    1000000,
  );
  positive(
    input.callerClinicianOrderedPiecesPerDay,
    "callerClinicianOrderedPiecesPerDay",
  );
  return {
    value:
      (input.actualWholeTabletInventory *
        input.callerProductQualifiedPiecesPerTablet) /
      input.callerClinicianOrderedPiecesPerDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualWholeTabletInventory: 10,
    callerProductQualifiedPiecesPerTablet: 2,
    callerClinicianOrderedPiecesPerDay: 4,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/tablet-split-days-supply",
  title: "Tablet Days Supply Split Calculator",
  description:
    "Actual qualified split table tablet inventory\u00d7pieces/tablet\u00f7independently ordered pieces/day. Not identify splittability, extended release/crushing permission or select dose. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
