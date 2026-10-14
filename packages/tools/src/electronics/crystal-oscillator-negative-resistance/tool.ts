import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerActualTransconductanceSiemens: number;
  readonly actualAngularFrequencyPerSecond: number;
  readonly actualFirstLoadCapacitanceFarads: number;
  readonly actualSecondLoadCapacitanceFarads: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerActualTransconductanceSiemens",
    label: "Caller actual transconductance siemens",
    kind: "number",
  },
  {
    id: "actualAngularFrequencyPerSecond",
    label: "Actual angular frequency per second",
    kind: "number",
  },
  {
    id: "actualFirstLoadCapacitanceFarads",
    label: "Actual first load capacitance farads",
    kind: "number",
  },
  {
    id: "actualSecondLoadCapacitanceFarads",
    label: "Actual second load capacitance farads",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerActualTransconductanceSiemens,
    "callerActualTransconductanceSiemens",
  );
  positive(
    input.actualAngularFrequencyPerSecond,
    "actualAngularFrequencyPerSecond",
  );
  positive(
    input.actualFirstLoadCapacitanceFarads,
    "actualFirstLoadCapacitanceFarads",
  );
  positive(
    input.actualSecondLoadCapacitanceFarads,
    "actualSecondLoadCapacitanceFarads",
  );
  return {
    value:
      -input.callerActualTransconductanceSiemens /
      (input.actualAngularFrequencyPerSecond ** 2 *
        input.actualFirstLoadCapacitanceFarads *
        input.actualSecondLoadCapacitanceFarads),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerActualTransconductanceSiemens: 2,
    actualAngularFrequencyPerSecond: 2,
    actualFirstLoadCapacitanceFarads: 1,
    actualSecondLoadCapacitanceFarads: 1,
  },
  output: { result: { value: -0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/crystal-oscillator-negative-resistance",
  title: "Crystal Oscillator Negative Resistance Calculator",
  description:
    "Declared idealPierce small signal negative resistance\u2212gm/(\u03c9\u00b2C1C2), transistor/parasitic limits omitted, no oscillation startup safety inferred. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
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
