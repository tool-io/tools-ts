import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  interpolate,
  integral,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedVoltagesV: readonly number[];
  readonly observedDifferentialCapacitancesF: readonly number[];
  readonly chargeStartVoltageV: number;
  readonly chargeEndVoltageV: number;
}>;
export type Output = Readonly<{
  readonly interpolatedEndDifferentialCapacitanceF: number;
  readonly integratedDeliveredChargeC: number;
}>;
const inputFields = [
  { id: "observedVoltagesV", label: "Observed voltages v", kind: "numberList" },
  {
    id: "observedDifferentialCapacitancesF",
    label: "Observed differential capacitances f",
    kind: "numberList",
  },
  {
    id: "chargeStartVoltageV",
    label: "Charge start voltage v",
    kind: "number",
  },
  { id: "chargeEndVoltageV", label: "Charge end voltage v", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDifferentialCapacitancesF.forEach((v) =>
    positive(v, "observedDifferentialCapacitancesF"),
  );
  input.observedVoltagesV.forEach((v) => nonnegative(v, "observedVoltagesV"));
  nonnegative(input.chargeStartVoltageV, "chargeStartVoltageV");
  nonnegative(input.chargeEndVoltageV, "chargeEndVoltageV");
  aligned(
    input.observedVoltagesV,
    input.observedDifferentialCapacitancesF,
    "observedVoltagesV",
  );
  if (input.chargeEndVoltageV < input.chargeStartVoltageV)
    simpleError("voltage", "Ordered charging voltage interval required.");
  interpolate(
    input.observedVoltagesV,
    input.observedDifferentialCapacitancesF,
    input.chargeStartVoltageV,
  );
  const end = interpolate(
      input.observedVoltagesV,
      input.observedDifferentialCapacitancesF,
      input.chargeEndVoltageV,
    ),
    points = [
      input.chargeStartVoltageV,
      ...input.observedVoltagesV.filter(
        (v) => v > input.chargeStartVoltageV && v < input.chargeEndVoltageV,
      ),
      input.chargeEndVoltageV,
    ];
  return {
    interpolatedEndDifferentialCapacitanceF: end,
    integratedDeliveredChargeC:
      input.chargeEndVoltageV === input.chargeStartVoltageV
        ? 0
        : integral(
            points,
            points.map((v) =>
              interpolate(
                input.observedVoltagesV,
                input.observedDifferentialCapacitancesF,
                v,
              ),
            ),
          ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVoltagesV: [0, 1, 2],
  observedDifferentialCapacitancesF: [2, 4, 6],
  chargeStartVoltageV: 0,
  chargeEndVoltageV: 2,
} satisfies Input;
export const exampleOutput = {
  interpolatedEndDifferentialCapacitanceF: 6,
  integratedDeliveredChargeC: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/supercapacitor-capacitance-vs-voltage",
  title: "Supercapacitor Capacitance Vs Voltage Calculator",
  description:
    "Read measured voltage-dependent differential capacitance and integrate C(V)dV for actual charge interval; not constant-capacitance energy, capacitance tempco or inferring differential C from unspecified nominal rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedEndDifferentialCapacitanceF",
      label: "Interpolated end differential capacitance f",
      kind: "number",
    },
    {
      id: "integratedDeliveredChargeC",
      label: "Integrated delivered charge c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedVoltagesV: value.observedVoltagesV as readonly number[],
      observedDifferentialCapacitancesF:
        value.observedDifferentialCapacitancesF as readonly number[],
      chargeStartVoltageV: value.chargeStartVoltageV as number,
      chargeEndVoltageV: value.chargeEndVoltageV as number,
    }),
});
export const run = tool.execute;
export default tool;
