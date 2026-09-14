import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedStorageChangeM3: number;
  readonly actualMatchedTotalInflowM3: number;
  readonly actualMatchedTotalOutflowM3: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedStorageChangeM3",
    label: "Actual observed storage change m3",
    kind: "number",
  },
  {
    id: "actualMatchedTotalInflowM3",
    label: "Actual matched total inflow m3",
    kind: "number",
  },
  {
    id: "actualMatchedTotalOutflowM3",
    label: "Actual matched total outflow m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualMatchedTotalInflowM3, "actualMatchedTotalInflowM3");
  nonnegative(input.actualMatchedTotalOutflowM3, "actualMatchedTotalOutflowM3");
  return {
    value:
      input.actualObservedStorageChangeM3 -
      (input.actualMatchedTotalInflowM3 - input.actualMatchedTotalOutflowM3),
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
    actualObservedStorageChangeM3: 2,
    actualMatchedTotalInflowM3: 5,
    actualMatchedTotalOutflowM3: 2,
  },
  output: { result: { value: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/inflow-outflow-storage-residual-checker",
  title: "Inflow Outflow Storage Residual Checker",
  description:
    "Signedstorageledgerresidualobserved\u0394S\u2212(I\u2212O),periodscopescomplete/external,no automaticallyinvent unmeasuredgroundwater. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
