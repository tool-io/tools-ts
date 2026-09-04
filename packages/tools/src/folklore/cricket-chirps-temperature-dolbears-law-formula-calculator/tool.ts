import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
  simpleError,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly observedChirpsPerMinute: number;
  readonly callerApplicableMinimumChirpsPerMinute: number;
  readonly callerApplicableMaximumChirpsPerMinute: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedChirpsPerMinute",
    label: "Observed chirps per minute",
    kind: "number",
  },
  {
    id: "callerApplicableMinimumChirpsPerMinute",
    label: "Caller applicable minimum chirps per minute",
    kind: "number",
  },
  {
    id: "callerApplicableMaximumChirpsPerMinute",
    label: "Caller applicable maximum chirps per minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerApplicableMinimumChirpsPerMinute, "minimum");
  ordered(
    input.callerApplicableMinimumChirpsPerMinute,
    input.callerApplicableMaximumChirpsPerMinute,
  );
  if (
    input.observedChirpsPerMinute <
      input.callerApplicableMinimumChirpsPerMinute ||
    input.observedChirpsPerMinute > input.callerApplicableMaximumChirpsPerMinute
  )
    simpleError(
      "chirps",
      "No extrapolation beyond caller independently established applicable band.",
    );
  const f = 50 + (input.observedChirpsPerMinute - 40) / 4;
  return {
    conditionalTemperatureF: f,
    conditionalTemperatureC: ((f - 32) * 5) / 9,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedChirpsPerMinute: 40,
    callerApplicableMinimumChirpsPerMinute: 40,
    callerApplicableMaximumChirpsPerMinute: 120,
  },
  output: {
    result: { conditionalTemperatureF: 50, conditionalTemperatureC: 10 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/cricket-chirps-temperature-dolbears-law-formula-calculator",
  title: "Cricket Chirps TemperatureDolbear's Law Formula Calculator",
  description:
    "Conditional historical Dolbear 1897 form T\u00b0F=50+(Nperminute\u221240)/4. Caller independently verifies species, counting interval, conditions and applicable calibrated chirp-rate band; no universal cricket thermometer or weather forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
