import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerEstablishedMtbfHours: number;
  readonly callerEstablishedMttrHours: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerEstablishedMtbfHours",
    label: "Caller established mtbf hours",
    kind: "number",
  },
  {
    id: "callerEstablishedMttrHours",
    label: "Caller established mttr hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.callerEstablishedMtbfHours, "callerEstablishedMtbfHours");
  nonnegative(input.callerEstablishedMttrHours, "callerEstablishedMttrHours");
  return {
    value:
      input.callerEstablishedMtbfHours /
      (input.callerEstablishedMtbfHours + input.callerEstablishedMttrHours),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerEstablishedMtbfHours: 4, callerEstablishedMttrHours: 1 },
  output: { result: { value: 0.8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/reliability-availability",
  title: "Availability Calculator",
  description:
    "Ideal inherent steady availability or MTBF/(MTBF+MTTR), independently compatible operating/repair definitions; planned/logistic down time external. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
