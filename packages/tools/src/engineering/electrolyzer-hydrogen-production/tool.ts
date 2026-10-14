import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualElectrolyzerCurrentAmps: number;
  readonly actualOperatingSeconds: number;
  readonly callerIndependentFaradaicEfficiency: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualElectrolyzerCurrentAmps",
    label: "Actual electrolyzer current amps",
    kind: "number",
  },
  {
    id: "actualOperatingSeconds",
    label: "Actual operating seconds",
    kind: "number",
  },
  {
    id: "callerIndependentFaradaicEfficiency",
    label: "Caller independent faradaic efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualElectrolyzerCurrentAmps,
    "actualElectrolyzerCurrentAmps",
  );
  nonnegative(input.actualOperatingSeconds, "actualOperatingSeconds");
  fraction(
    input.callerIndependentFaradaicEfficiency,
    "callerIndependentFaradaicEfficiency",
  );
  return {
    value:
      (input.actualElectrolyzerCurrentAmps *
        input.actualOperatingSeconds *
        input.callerIndependentFaradaicEfficiency) /
      (2 * 96485.33212),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualElectrolyzerCurrentAmps: 2,
    actualOperatingSeconds: 96485.33212,
    callerIndependentFaradaicEfficiency: 1,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/electrolyzer-hydrogen-production",
  title: "Electrolyzer Hydrogen Production Calculator",
  description:
    "Faraday hydrogen molesI t \u03b7/(2F), actual net current/time and independent efficiency; no mass/energy efficiency or electrolyzer safety. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
