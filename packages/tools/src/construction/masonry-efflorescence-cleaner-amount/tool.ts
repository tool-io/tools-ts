import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedTreatmentArea: number;
  readonly callerManufacturerSpecifiedProductAmountPerArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedTreatmentArea",
    label: "Actual qualified treatment area",
    kind: "number",
  },
  {
    id: "callerManufacturerSpecifiedProductAmountPerArea",
    label: "Caller manufacturer specified product amount per area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualQualifiedTreatmentArea,
    "actualQualifiedTreatmentArea",
  );
  nonnegative(
    input.callerManufacturerSpecifiedProductAmountPerArea,
    "callerManufacturerSpecifiedProductAmountPerArea",
  );
  return {
    value:
      input.actualQualifiedTreatmentArea *
      input.callerManufacturerSpecifiedProductAmountPerArea,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedTreatmentArea: 10,
    callerManufacturerSpecifiedProductAmountPerArea: 2,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/masonry-efflorescence-cleaner-amount",
  title: "Efflorescence Cleaner Amount Calculator",
  description:
    "Bookkeeping actual treatment area\u00d7independent verified cleaner amount per area; no acid concentration, application recipe, compatibility or safe handling instructions. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
