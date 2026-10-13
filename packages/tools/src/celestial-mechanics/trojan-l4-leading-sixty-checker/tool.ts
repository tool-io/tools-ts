import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly signedRelativeLongitudeDegrees: number;
  readonly callerAngularToleranceDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "signedRelativeLongitudeDegrees",
    label: "Signed relative longitude degrees",
    kind: "number",
  },
  {
    id: "callerAngularToleranceDegrees",
    label: "Caller angular tolerance degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  angle(i.signedRelativeLongitudeDegrees, "longitude", -360, 360);
  angle(i.callerAngularToleranceDegrees, "tolerance", 0, 180);
  const delta = ((i.signedRelativeLongitudeDegrees - 60 + 540) % 360) - 180;
  return {
    signedAngularDepartureDegrees: delta,
    withinCallerAngularTolerance:
      Math.abs(delta) <= i.callerAngularToleranceDegrees,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    signedRelativeLongitudeDegrees: 60,
    callerAngularToleranceDegrees: 1,
  },
  output: {
    result: {
      signedAngularDepartureDegrees: 0,
      withinCallerAngularTolerance: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/trojan-l4-leading-sixty-checker",
  title: "Trojan L4 Leading Sixty Degrees Position Checker",
  description:
    "Angular-only leading L4 screen relative to secondary, not libration family, orbital identity or dynamical stability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedAngularDepartureDegrees: { type: "number" },
          withinCallerAngularTolerance: { type: "boolean" },
        },
        required: [
          "signedAngularDepartureDegrees",
          "withinCallerAngularTolerance",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
