import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly prismDeflectionAngleDegrees: number;
  readonly countedTreeWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly basalAreaFactorM2PerHectare: number;
  readonly angleCountBasalAreaM2PerHectare: number;
}>;
const inputFields = [
  {
    id: "prismDeflectionAngleDegrees",
    label: "Prism deflection angle degrees",
    kind: "number",
  },
  {
    id: "countedTreeWeights",
    label: "Counted tree weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.prismDeflectionAngleDegrees, "prismDeflectionAngleDegrees");
  input.countedTreeWeights.forEach((v) => fraction(v, "countedTreeWeights"));
  if (input.prismDeflectionAngleDegrees >= 90)
    simpleError(
      "prismDeflectionAngleDegrees",
      "Deflection angle below 90 degrees required.",
    );
  const basalAreaFactorM2PerHectare =
    10000 * Math.sin((input.prismDeflectionAngleDegrees * Math.PI) / 360) ** 2;
  return {
    basalAreaFactorM2PerHectare,
    angleCountBasalAreaM2PerHectare:
      basalAreaFactorM2PerHectare *
      input.countedTreeWeights.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  prismDeflectionAngleDegrees: 1.1459346897143055,
  countedTreeWeights: [1, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  basalAreaFactorM2PerHectare: 1,
  angleCountBasalAreaM2PerHectare: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/basal-area-factor-prism",
  title: "Prism Basal Area Factor",
  description:
    "Convert measured prism deflection angle to metric BAF and sum caller inclusion weights, including explicitly half-counted border trees; sampling protocol determines weights and this is not a fixed-plot tree-area alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "basalAreaFactorM2PerHectare",
      label: "Basal area factor m2 per hectare",
      kind: "number",
    },
    {
      id: "angleCountBasalAreaM2PerHectare",
      label: "Angle count basal area m2 per hectare",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      prismDeflectionAngleDegrees: value.prismDeflectionAngleDegrees as number,
      countedTreeWeights: value.countedTreeWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
