import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  money,
  roundMinor,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedVolunteerMinutesByRole: readonly number[];
  readonly callerCalibratedReferenceHourlyValuesMinor: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedVolunteerMinutesByRole",
    label: "Observed volunteer minutes by role",
    kind: "numberList",
  },
  {
    id: "callerCalibratedReferenceHourlyValuesMinor",
    label: "Caller calibrated reference hourly values minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.observedVolunteerMinutesByRole,
    input.callerCalibratedReferenceHourlyValuesMinor,
    "roles",
  );
  input.observedVolunteerMinutesByRole.forEach((v) =>
    bounded(v, "minutes", 0, 1000000000),
  );
  input.callerCalibratedReferenceHourlyValuesMinor.forEach((v) =>
    money(v, "hourlyreference"),
  );
  const t = input.observedVolunteerMinutesByRole.reduce(
    (a, v, i) =>
      a +
      BigInt(v) * BigInt(input.callerCalibratedReferenceHourlyValuesMinor[i]),
    0n,
  );
  return { conditionalVolunteerReferenceValueMinor: roundMinor(t, 60n) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedVolunteerMinutesByRole: [60, 30],
    callerCalibratedReferenceHourlyValuesMinor: [100, 200],
  },
  output: { result: { conditionalVolunteerReferenceValueMinor: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/volunteer-hour-value-calculator",
  title: "Volunteer Hour Monetary Value Calculator",
  description:
    "Conditional reference valuation of actual nonoverlapping volunteer minutes by independently calibrated role hourly values. Exact minor units, round once nearest with ties away from zero; not wages owed, in-kind accounting authority or value of a persons worth.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
