import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerEngineerSpecifiedWeirDischarge: number;
  readonly callerCalibratedWeirDischargeCoefficient: number;
  readonly callerGravityMetersPerSecondSquared: number;
  readonly actualHeadAboveCrestMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerEngineerSpecifiedWeirDischarge",
    label: "Caller engineer specified weir discharge",
    kind: "number",
  },
  {
    id: "callerCalibratedWeirDischargeCoefficient",
    label: "Caller calibrated weir discharge coefficient",
    kind: "number",
  },
  {
    id: "callerGravityMetersPerSecondSquared",
    label: "Caller gravity meters per second squared",
    kind: "number",
  },
  {
    id: "actualHeadAboveCrestMeters",
    label: "Actual head above crest meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerEngineerSpecifiedWeirDischarge,
    "callerEngineerSpecifiedWeirDischarge",
  );
  positive(
    input.callerCalibratedWeirDischargeCoefficient,
    "callerCalibratedWeirDischargeCoefficient",
  );
  positive(
    input.callerGravityMetersPerSecondSquared,
    "callerGravityMetersPerSecondSquared",
  );
  positive(input.actualHeadAboveCrestMeters, "actualHeadAboveCrestMeters");
  return {
    value:
      input.callerEngineerSpecifiedWeirDischarge /
      ((2 / 3) *
        input.callerCalibratedWeirDischargeCoefficient *
        Math.sqrt(2 * input.callerGravityMetersPerSecondSquared) *
        input.actualHeadAboveCrestMeters ** 1.5),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerEngineerSpecifiedWeirDischarge: 1,
    callerCalibratedWeirDischargeCoefficient: 1,
    callerGravityMetersPerSecondSquared: 2,
    actualHeadAboveCrestMeters: 1,
  },
  output: { result: { value: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/detention-basin-weir-length",
  title: "Plumbing Detention Basin Weir Length Calculator",
  description:
    "Conditional free sharpRECTANGULARweirL=Q/[(2/3) Cd\u221a2g h^1.5], independent end contraction/submergence external; not triangular notch or generated safe basin outlet. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
