import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyFittedInfraredTemperatureKelvin: number;
  readonly callerCandidateMinimumKelvin: number;
  readonly callerCandidateMaximumKelvin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyFittedInfraredTemperatureKelvin",
    label: "Independently fitted infrared temperature kelvin",
    kind: "number",
  },
  {
    id: "callerCandidateMinimumKelvin",
    label: "Caller candidate minimum kelvin",
    kind: "number",
  },
  {
    id: "callerCandidateMaximumKelvin",
    label: "Caller candidate maximum kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyFittedInfraredTemperatureKelvin, "temperature");
  positive(input.callerCandidateMinimumKelvin, "minimum");
  if (input.callerCandidateMaximumKelvin < input.callerCandidateMinimumKelvin)
    simpleError("range", "Ordered independently applicable window.");
  return {
    withinCallerTemperatureWindow:
      input.independentlyFittedInfraredTemperatureKelvin >=
        input.callerCandidateMinimumKelvin &&
      input.independentlyFittedInfraredTemperatureKelvin <=
        input.callerCandidateMaximumKelvin,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyFittedInfraredTemperatureKelvin: 300,
    callerCandidateMinimumKelvin: 200,
    callerCandidateMaximumKelvin: 500,
  },
  output: { result: { withinCallerTemperatureWindow: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/dyson-sphere-ir-excess-classifier",
  title: "Dyson Sphere IR Excess Temperature Signature Classifier",
  description:
    "Conditional observed IRtemperature-window screen inclusive endpoints. Dust, stars and other natural sources remain possible; not Dyson-sphere identification, artificiality or reliable blackbody fitting.",
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
