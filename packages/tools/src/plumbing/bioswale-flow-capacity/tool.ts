import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualBioswaleWettedFlowAreaSquareMeters: number;
  readonly actualBioswaleHydraulicRadiusMeters: number;
  readonly actualFrictionEnergySlope: number;
  readonly callerCalibratedBioswaleManningN: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBioswaleWettedFlowAreaSquareMeters",
    label: "Actual bioswale wetted flow area square meters",
    kind: "number",
  },
  {
    id: "actualBioswaleHydraulicRadiusMeters",
    label: "Actual bioswale hydraulic radius meters",
    kind: "number",
  },
  {
    id: "actualFrictionEnergySlope",
    label: "Actual friction energy slope",
    kind: "number",
  },
  {
    id: "callerCalibratedBioswaleManningN",
    label: "Caller calibrated bioswale manning n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualBioswaleWettedFlowAreaSquareMeters,
    "actualBioswaleWettedFlowAreaSquareMeters",
  );
  positive(
    input.actualBioswaleHydraulicRadiusMeters,
    "actualBioswaleHydraulicRadiusMeters",
  );
  nonnegative(input.actualFrictionEnergySlope, "actualFrictionEnergySlope");
  positive(
    input.callerCalibratedBioswaleManningN,
    "callerCalibratedBioswaleManningN",
  );
  return {
    value:
      (input.actualBioswaleWettedFlowAreaSquareMeters *
        input.actualBioswaleHydraulicRadiusMeters ** (2 / 3) *
        Math.sqrt(input.actualFrictionEnergySlope)) /
      input.callerCalibratedBioswaleManningN,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBioswaleWettedFlowAreaSquareMeters: 5,
    actualBioswaleHydraulicRadiusMeters: 1,
    actualFrictionEnergySlope: 1,
    callerCalibratedBioswaleManningN: 1,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/bioswale-flow-capacity",
  title: "Plumbing Bioswale Flow Capacity Calculator",
  description:
    "Ideal uniform open channel bioswale ManningQ=AR^(2/3)\u221aS/n, actual calibrated roughness/wetted geometry, no infiltration/vegetation storage or rainfall capacity certification. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
