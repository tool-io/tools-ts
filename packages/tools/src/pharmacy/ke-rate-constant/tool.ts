import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyEstablishedClearanceVolumePerHour: number;
  readonly actualIndependentlyEstablishedDistributionVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyEstablishedClearanceVolumePerHour",
    label: "Actual independently established clearance volume per hour",
    kind: "number",
  },
  {
    id: "actualIndependentlyEstablishedDistributionVolume",
    label: "Actual independently established distribution volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualIndependentlyEstablishedClearanceVolumePerHour,
    "actualIndependentlyEstablishedClearanceVolumePerHour",
  );
  positive(
    input.actualIndependentlyEstablishedDistributionVolume,
    "actualIndependentlyEstablishedDistributionVolume",
  );
  return {
    value:
      input.actualIndependentlyEstablishedClearanceVolumePerHour /
      input.actualIndependentlyEstablishedDistributionVolume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyEstablishedClearanceVolumePerHour: 2,
    actualIndependentlyEstablishedDistributionVolume: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/ke-rate-constant",
  title: "Ke Rate Constant Calculator",
  description:
    "One compartment first-orderke=CL/Vd, matched independently fitted units; not infer terminal log decay from unqualified observations. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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
