import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerMatchedHazenWilliamsC: number;
  readonly actualHydraulicRadiusMeters: number;
  readonly actualHydraulicGradient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMatchedHazenWilliamsC",
    label: "Caller matched hazen williams c",
    kind: "number",
  },
  {
    id: "actualHydraulicRadiusMeters",
    label: "Actual hydraulic radius meters",
    kind: "number",
  },
  {
    id: "actualHydraulicGradient",
    label: "Actual hydraulic gradient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerMatchedHazenWilliamsC, "callerMatchedHazenWilliamsC");
  positive(input.actualHydraulicRadiusMeters, "actualHydraulicRadiusMeters");
  nonnegative(input.actualHydraulicGradient, "actualHydraulicGradient");
  return {
    value:
      0.849 *
      input.callerMatchedHazenWilliamsC *
      input.actualHydraulicRadiusMeters ** 0.63 *
      input.actualHydraulicGradient ** 0.54,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMatchedHazenWilliamsC: 1,
    actualHydraulicRadiusMeters: 1,
    actualHydraulicGradient: 1,
  },
  output: { result: { value: 0.849 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hazen-williams-velocity",
  title: "Plumbing Hazen Williams Velocity Calculator",
  description:
    "Metric Hazen\u2013Williams velocity .849CR^.63S^.54, actual hydraulic radius and friction gradient, not inverseQ/d\u00b2or assume code applicability. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
