import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly surfaceTensionNPerM: number;
  readonly initialGasEquivalentPressurePa: number;
  readonly initialAmbientPressurePa: number;
  readonly pressureDropPa: number;
  readonly preexistingBubbleRadiusM: number;
}>;
export type Output = Readonly<{
  readonly finalSupersaturationPressurePa: number;
  readonly criticalBubbleRadiusM: number;
  readonly callerNucleusCanGrowUnderModel: boolean;
}>;
const inputFields = [
  {
    id: "surfaceTensionNPerM",
    label: "Surface tension n per m",
    kind: "number",
  },
  {
    id: "initialGasEquivalentPressurePa",
    label: "Initial gas equivalent pressure pa",
    kind: "number",
  },
  {
    id: "initialAmbientPressurePa",
    label: "Initial ambient pressure pa",
    kind: "number",
  },
  { id: "pressureDropPa", label: "Pressure drop pa", kind: "number" },
  {
    id: "preexistingBubbleRadiusM",
    label: "Preexisting bubble radius m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.surfaceTensionNPerM, "surfaceTensionNPerM");
  positive(
    input.initialGasEquivalentPressurePa,
    "initialGasEquivalentPressurePa",
  );
  positive(input.initialAmbientPressurePa, "initialAmbientPressurePa");
  positive(input.preexistingBubbleRadiusM, "preexistingBubbleRadiusM");
  nonnegative(input.pressureDropPa, "pressureDropPa");
  const ambient = positive(
      input.initialAmbientPressurePa - input.pressureDropPa,
      "pressureDropPa",
    ),
    finalSupersaturationPressurePa = positive(
      input.initialGasEquivalentPressurePa - ambient,
      "supersaturation",
    ),
    criticalBubbleRadiusM =
      (2 * input.surfaceTensionNPerM) / finalSupersaturationPressurePa;
  return {
    finalSupersaturationPressurePa,
    criticalBubbleRadiusM,
    callerNucleusCanGrowUnderModel:
      input.preexistingBubbleRadiusM >= criticalBubbleRadiusM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  surfaceTensionNPerM: 0.1,
  initialGasEquivalentPressurePa: 200000,
  initialAmbientPressurePa: 190000,
  pressureDropPa: 10000,
  preexistingBubbleRadiusM: 1e-5,
} satisfies Input;
export const exampleOutput = {
  finalSupersaturationPressurePa: 20000,
  criticalBubbleRadiusM: 1e-5,
  callerNucleusCanGrowUnderModel: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/bubble-nucleation-supersaturation-drop",
  title: "Bubble Nucleation Supersaturation Drop",
  description:
    "Screen Laplace critical radius after a caller decompression while gas-equivalent pressure remains fixed; homogeneous nucleation barriers/kinetics and eruption triggering are not established.",
  inputs: inputFields,
  outputs: [
    {
      id: "finalSupersaturationPressurePa",
      label: "Final supersaturation pressure pa",
      kind: "number",
    },
    {
      id: "criticalBubbleRadiusM",
      label: "Critical bubble radius m",
      kind: "number",
    },
    {
      id: "callerNucleusCanGrowUnderModel",
      label: "Caller nucleus can grow under model",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      surfaceTensionNPerM: value.surfaceTensionNPerM as number,
      initialGasEquivalentPressurePa:
        value.initialGasEquivalentPressurePa as number,
      initialAmbientPressurePa: value.initialAmbientPressurePa as number,
      pressureDropPa: value.pressureDropPa as number,
      preexistingBubbleRadiusM: value.preexistingBubbleRadiusM as number,
    }),
});
export const run = tool.execute;
export default tool;
