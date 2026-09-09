import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyCalibratedHazenCoefficientPerMeterSecond: number;
  readonly actualEffectiveGrainDiameterMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyCalibratedHazenCoefficientPerMeterSecond",
    label: "Caller independently calibrated hazen coefficient per meter second",
    kind: "number",
  },
  {
    id: "actualEffectiveGrainDiameterMeters",
    label: "Actual effective grain diameter meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualEffectiveGrainDiameterMeters, "d10");
  positive(
    input.callerIndependentlyCalibratedHazenCoefficientPerMeterSecond,
    "C",
  );
  return {
    conditionalHazenHydraulicConductivityMetersPerSecond:
      input.callerIndependentlyCalibratedHazenCoefficientPerMeterSecond *
      input.actualEffectiveGrainDiameterMeters ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyCalibratedHazenCoefficientPerMeterSecond: 2,
    actualEffectiveGrainDiameterMeters: 3,
  },
  output: {
    result: { conditionalHazenHydraulicConductivityMetersPerSecond: 18 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/hydraulic-conductivity-hazen",
  title: "Geology Hydraulic Conductivity Hazen Calculator",
  description:
    "Explicit hydraulic conductivity KH=C*d10\u00b2with diameter meters and independently calibrated Cunits1/(m\u00b7s). Applicable granular-soil domain externally verified; not intrinsic permeability, mixed cm/mmformula or universally fitted Hazenconstant.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
