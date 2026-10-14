import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualEscalatorInputWattsByInterval: readonly number[];
  readonly actualIntervalHours: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualEscalatorInputWattsByInterval",
    label: "Actual escalator input watts by interval",
    kind: "numberList",
  },
  {
    id: "actualIntervalHours",
    label: "Actual interval hours",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!input.actualEscalatorInputWattsByInterval.length)
    simpleError(
      "actualEscalatorInputWattsByInterval",
      "Actual nonempty observations.",
    );
  input.actualEscalatorInputWattsByInterval.forEach((v) =>
    nonnegative(v, "actualEscalatorInputWattsByInterval"),
  );
  if (!input.actualIntervalHours.length)
    simpleError("actualIntervalHours", "Actual nonempty observations.");
  input.actualIntervalHours.forEach((v) => positive(v, "actualIntervalHours"));
  aligned(
    input.actualEscalatorInputWattsByInterval,
    input.actualIntervalHours,
    "intervals",
  );
  return {
    value: sum(
      input.actualEscalatorInputWattsByInterval.map(
        (v, i) => v * input.actualIntervalHours[i],
      ),
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEscalatorInputWattsByInterval: [10, 20],
    actualIntervalHours: [1, 2],
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/escalator-energy-consumption",
  title: "Escalator Energy Consumption Calculator",
  description:
    "Actual electrical input powers\u00d7disjoint elapsed hours sumWh, not gravitational-load-only estimate or manufacturer performance. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
