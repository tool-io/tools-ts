import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{ readonly dereddenedBMinusV: number }>;
export type Output = Readonly<{
  readonly ballesterosTemperatureKelvin: number;
}>;
const inputFields = [
  { id: "dereddenedBMinusV", label: "Dereddened b minus v", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.dereddenedBMinusV < -0.4 || input.dereddenedBMinusV > 2)
    simpleError("color", "Declared empiricalB−Vdomain−0.4..2.");
  return {
    ballesterosTemperatureKelvin:
      4600 *
      (1 / (0.92 * input.dereddenedBMinusV + 1.7) +
        1 / (0.92 * input.dereddenedBMinusV + 0.62)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { dereddenedBMinusV: 0 } satisfies Input;
export const exampleOutput = {
  ballesterosTemperatureKelvin: 10125.237191650855,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/color-index-bv-temperature",
  title: "B-V Color Index Temperature Estimator",
  description:
    "Ballesteros 2012 approximate temperature from independently dereddened Johnson B−V, bounded−0.4..2 for stellar-color proxy; not reddening inference. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "ballesterosTemperatureKelvin",
      label: "Ballesteros temperature kelvin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ dereddenedBMinusV: value.dereddenedBMinusV as number }),
});
export const run = tool.execute;
export default tool;
