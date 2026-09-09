import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredEmissionLevelsDb: readonly number[];
  readonly matchedNoiseFloorLevelsDb: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredEmissionLevelsDb",
    label: "Independently measured emission levels db",
    kind: "numberList",
  },
  {
    id: "matchedNoiseFloorLevelsDb",
    label: "Matched noise floor levels db",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredEmissionLevelsDb,
    input.matchedNoiseFloorLevelsDb,
    "frequencies",
  );
  return {
    observedEmissionMinusNoiseDb:
      input.independentlyMeasuredEmissionLevelsDb.map(
        (v, i) => v - input.matchedNoiseFloorLevelsDb[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredEmissionLevelsDb: [10, 20],
    matchedNoiseFloorLevelsDb: [4, 25],
  },
  output: { result: { observedEmissionMinusNoiseDb: [6, -5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/otoacoustic-emission-snr",
  title: "Otoacoustic Emission SNR Calculator",
  description:
    "Actual same-reference OAEemission-minus-noise levels in dBper matched frequency, retaining negative SNR. No automatic hearing-status inference or generic broadband power ratio.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
