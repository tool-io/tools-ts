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
  fraction,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly effectiveDiameterM: number;
  readonly porosity: number;
  readonly calibratedKozenyDenominator: number;
}>;
export type Output = Readonly<{ readonly permeabilityM2: number }>;
const inputFields = [
  { id: "effectiveDiameterM", label: "Effective diameter m", kind: "number" },
  { id: "porosity", label: "Porosity", kind: "number" },
  {
    id: "calibratedKozenyDenominator",
    label: "Calibrated kozeny denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.effectiveDiameterM, "effectiveDiameterM");
  positive(input.calibratedKozenyDenominator, "calibratedKozenyDenominator");
  fraction(input.porosity, "porosity");
  if (input.porosity >= 1) simpleError("porosity", "n<1.");
  const n = input.porosity;
  return {
    permeabilityM2:
      (input.effectiveDiameterM ** 2 * n ** 3) /
      (input.calibratedKozenyDenominator * (1 - n) ** 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  effectiveDiameterM: 0.01,
  porosity: 0.5,
  calibratedKozenyDenominator: 180,
} satisfies Input;
export const exampleOutput = {
  permeabilityM2: 2.777777777777778e-7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/permeability-kozeny-carman",
  title: "Geology Permeability Kozeny Carman Calculator",
  description:
    "Kozeny–Carman intrinsic permeability with independently calibrated grain convention/geometry factor, not hydraulic conductivity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "permeabilityM2", label: "Permeability m2", kind: "number" }],
  calculate: (value) =>
    calculate({
      effectiveDiameterM: value.effectiveDiameterM as number,
      porosity: value.porosity as number,
      calibratedKozenyDenominator: value.calibratedKozenyDenominator as number,
    }),
});
export const run = tool.execute;
export default tool;
