import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerEffectiveContactConductanceWattsPerSquareMeterKelvin: number;
  readonly actualContactAreaSquareMeters: number;
  readonly actualSkinToSurfaceTemperatureDifferenceKelvin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerEffectiveContactConductanceWattsPerSquareMeterKelvin",
    label: "Caller effective contact conductance watts per square meter kelvin",
    kind: "number",
  },
  {
    id: "actualContactAreaSquareMeters",
    label: "Actual contact area square meters",
    kind: "number",
  },
  {
    id: "actualSkinToSurfaceTemperatureDifferenceKelvin",
    label: "Actual skin to surface temperature difference kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerEffectiveContactConductanceWattsPerSquareMeterKelvin,
    "conductance",
  );
  nonnegative(input.actualContactAreaSquareMeters, "area");
  return {
    conditionalSignedContactHeatLossWatts:
      input.callerEffectiveContactConductanceWattsPerSquareMeterKelvin *
      input.actualContactAreaSquareMeters *
      input.actualSkinToSurfaceTemperatureDifferenceKelvin,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerEffectiveContactConductanceWattsPerSquareMeterKelvin: 2,
    actualContactAreaSquareMeters: 3,
    actualSkinToSurfaceTemperatureDifferenceKelvin: 4,
  },
  output: { result: { conditionalSignedContactHeatLossWatts: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/body-heat-loss-sitting",
  title: "Caver Body Heat Loss Conduction Sitting Calculator",
  description:
    "Ideal actual contact-area\u00d7independently calibrated effective conductance\u00d7signed temperature difference. Insulation/contact/temperature independently established; not body core-temperature trajectory, hypothermia risk or safe sitting duration.",
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
