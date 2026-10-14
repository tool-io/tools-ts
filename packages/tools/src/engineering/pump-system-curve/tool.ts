import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualStaticHeadMeters: number;
  readonly callerCalibratedResistanceCoefficient: number;
  readonly actualFlow: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualStaticHeadMeters",
    label: "Actual static head meters",
    kind: "number",
  },
  {
    id: "callerCalibratedResistanceCoefficient",
    label: "Caller calibrated resistance coefficient",
    kind: "number",
  },
  { id: "actualFlow", label: "Actual flow", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.callerCalibratedResistanceCoefficient,
    "callerCalibratedResistanceCoefficient",
  );
  nonnegative(input.actualFlow, "actualFlow");
  return {
    value:
      input.actualStaticHeadMeters +
      input.callerCalibratedResistanceCoefficient * input.actualFlow ** 2,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualStaticHeadMeters: 2,
    callerCalibratedResistanceCoefficient: 1,
    actualFlow: 2,
  },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/pump-system-curve",
  title: "Pump System Curve Calculator",
  description:
    "Declared independently calibrated pump system head Hstatic+kQ\u00b2, signed static head and compatiblek/Qunits; not pump curve intersection or pressure safety. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
