import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerEngineerSpecifiedOrificeDischarge: number;
  readonly callerCalibratedOrificeCoefficient: number;
  readonly callerGravityMetersPerSecondSquared: number;
  readonly actualHeadMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerEngineerSpecifiedOrificeDischarge",
    label: "Caller engineer specified orifice discharge",
    kind: "number",
  },
  {
    id: "callerCalibratedOrificeCoefficient",
    label: "Caller calibrated orifice coefficient",
    kind: "number",
  },
  {
    id: "callerGravityMetersPerSecondSquared",
    label: "Caller gravity meters per second squared",
    kind: "number",
  },
  { id: "actualHeadMeters", label: "Actual head meters", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerEngineerSpecifiedOrificeDischarge,
    "callerEngineerSpecifiedOrificeDischarge",
  );
  positive(
    input.callerCalibratedOrificeCoefficient,
    "callerCalibratedOrificeCoefficient",
  );
  positive(
    input.callerGravityMetersPerSecondSquared,
    "callerGravityMetersPerSecondSquared",
  );
  positive(input.actualHeadMeters, "actualHeadMeters");
  return {
    value: Math.sqrt(
      (4 * input.callerEngineerSpecifiedOrificeDischarge) /
        (Math.PI *
          input.callerCalibratedOrificeCoefficient *
          Math.sqrt(
            2 *
              input.callerGravityMetersPerSecondSquared *
              input.actualHeadMeters,
          )),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerEngineerSpecifiedOrificeDischarge: 1,
    callerCalibratedOrificeCoefficient: 1,
    callerGravityMetersPerSecondSquared: 2,
    actualHeadMeters: 1,
  },
  output: { result: { value: 0.7978845608028654 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/detention-basin-outlet-orifice-size",
  title: "Plumbing Detention Basin Outlet Orifice Size Calculator",
  description:
    "Conditional inverse ideal circular orifice d=\u221a[4Q/(\u03c0Cd\u221a2gh)], externally engineer established flow/head/Cd, no emergency overflow or trash/debris safety. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
