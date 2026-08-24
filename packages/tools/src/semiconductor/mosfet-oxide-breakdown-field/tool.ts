import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mosfetOxideBreakdownFieldExample = {
  input: { breakdownVoltageV: 4, oxideThicknessNm: 2 },
  output: { breakdownFieldMVcm: 20 },
} satisfies ToolExample<
  MosfetOxideBreakdownFieldInput,
  MosfetOxideBreakdownFieldOutput
>;

export type MosfetOxideBreakdownFieldInput = {
  readonly breakdownVoltageV: number;
  readonly oxideThicknessNm: number;
};
export type MosfetOxideBreakdownFieldOutput = {
  readonly breakdownFieldMVcm: number;
};

export const calculateMosfetOxideBreakdownField = (
  input: MosfetOxideBreakdownFieldInput,
): MosfetOxideBreakdownFieldOutput => {
  if (input.oxideThicknessNm <= 0 || input.breakdownVoltageV <= 0)
    simpleError(
      "breakdownVoltageV",
      "Voltage and thickness must be positive.",
      "invalid_input",
    );
  return {
    breakdownFieldMVcm:
      (input.breakdownVoltageV / (input.oxideThicknessNm * 1e-7)) * 1e-6,
  };
};

export const mosfetOxideBreakdownFieldTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetOxideBreakdownField({
      breakdownVoltageV: input.breakdownVoltageV as number,
      oxideThicknessNm: input.oxideThicknessNm as number,
    }),
  description:
    "Compute the oxide breakdown electric field from BDV and oxide thickness.",
  id: "semiconductor/mosfet-oxide-breakdown-field",
  inputs: [
    {
      id: "breakdownVoltageV",
      kind: "number",
      label: "BDV",
      unit: "V",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "oxideThicknessNm",
      kind: "number",
      label: "tox",
      unit: "nm",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "breakdownFieldMVcm", kind: "number", label: "EBD", unit: "MV/cm" },
  ],
  title: "MOSFET Oxide Breakdown Field Calculator",
});
export const runMosfetOxideBreakdownField =
  mosfetOxideBreakdownFieldTool.execute;
export default mosfetOxideBreakdownFieldTool;
