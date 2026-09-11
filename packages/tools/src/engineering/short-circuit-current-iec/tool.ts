import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerApplicableVoltageFactor: number;
  readonly lineVoltageVolts: number;
  readonly actualPositiveSequenceImpedanceOhms: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerApplicableVoltageFactor",
    label: "Caller applicable voltage factor",
    kind: "number",
  },
  { id: "lineVoltageVolts", label: "Line voltage volts", kind: "number" },
  {
    id: "actualPositiveSequenceImpedanceOhms",
    label: "Actual positive sequence impedance ohms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerApplicableVoltageFactor,
    "callerApplicableVoltageFactor",
  );
  positive(input.lineVoltageVolts, "lineVoltageVolts");
  positive(
    input.actualPositiveSequenceImpedanceOhms,
    "actualPositiveSequenceImpedanceOhms",
  );
  return {
    value:
      (input.callerApplicableVoltageFactor * input.lineVoltageVolts) /
      (Math.sqrt(3) * input.actualPositiveSequenceImpedanceOhms),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerApplicableVoltageFactor: 1,
    lineVoltageVolts: 10,
    actualPositiveSequenceImpedanceOhms: 1,
  },
  output: { result: { value: 5.773502691896258 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/short-circuit-current-iec",
  title: "IEC Short-Circuit Current Calculator",
  description:
    "Declared IEC three phase initial symmetrical short circuit cUn/(\u221a3|Zk|), independently established sequence impedance/voltage factor; not generic one phase U/Z, motor contributions or certified fault duty. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
