import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedDeliveryWeightKg: number;
  readonly independentlyRecordedPrepregnancyWeightKg: number;
  readonly independentlyMeasuredAdultHeightMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedDeliveryWeightKg",
    label: "Independently recorded delivery weight kg",
    kind: "number",
  },
  {
    id: "independentlyRecordedPrepregnancyWeightKg",
    label: "Independently recorded prepregnancy weight kg",
    kind: "number",
  },
  {
    id: "independentlyMeasuredAdultHeightMeters",
    label: "Independently measured adult height meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyRecordedDeliveryWeightKg, "deliveryweight");
  positive(input.independentlyRecordedPrepregnancyWeightKg, "baseline");
  positive(input.independentlyMeasuredAdultHeightMeters, "height");
  const h = input.independentlyMeasuredAdultHeightMeters ** 2;
  return {
    observedDeliveryBmi: input.independentlyRecordedDeliveryWeightKg / h,
    signedDeliveryMinusPrepregnancyBmi:
      (input.independentlyRecordedDeliveryWeightKg -
        input.independentlyRecordedPrepregnancyWeightKg) /
      h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyRecordedDeliveryWeightKg: 70,
    independentlyRecordedPrepregnancyWeightKg: 60,
    independentlyMeasuredAdultHeightMeters: 1.5,
  },
  output: {
    result: {
      observedDeliveryBmi: 31.11111111111111,
      signedDeliveryMinusPrepregnancyBmi: 4.444444444444445,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/maternal-bmi-at-delivery",
  title: "BMI at Delivery Calculator",
  description:
    "Actual delivery-period versus prepregnancy BMI reconciliation. Pregnancy contents/fluids contribute to mass; not classify adiposity, diagnose risk or apply adult BMIcategories as pregnancy goals.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
