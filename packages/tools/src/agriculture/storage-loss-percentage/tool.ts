import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly initialDryAshFraction: number;
  readonly finalDryAshFraction: number;
  readonly initialWetBasisMoistureFraction: number;
  readonly finalWetBasisMoistureFraction: number;
}>;
export type Output = Readonly<{
  readonly ashTracerDryMatterRetentionFraction: number;
  readonly signedDryMatterLossPercent: number;
  readonly modelFinalInitialWetMassRatio: number;
}>;
const inputFields = [
  {
    id: "initialDryAshFraction",
    label: "Initial dry ash fraction",
    kind: "number",
  },
  {
    id: "finalDryAshFraction",
    label: "Final dry ash fraction",
    kind: "number",
  },
  {
    id: "initialWetBasisMoistureFraction",
    label: "Initial wet basis moisture fraction",
    kind: "number",
  },
  {
    id: "finalWetBasisMoistureFraction",
    label: "Final wet basis moisture fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialDryAshFraction, "initialDryAshFraction");
  positive(input.finalDryAshFraction, "finalDryAshFraction");
  fraction(input.initialDryAshFraction, "initialDryAshFraction");
  fraction(input.finalDryAshFraction, "finalDryAshFraction");
  fraction(
    input.initialWetBasisMoistureFraction,
    "initialWetBasisMoistureFraction",
  );
  fraction(
    input.finalWetBasisMoistureFraction,
    "finalWetBasisMoistureFraction",
  );
  if (
    input.initialWetBasisMoistureFraction === 1 ||
    input.finalWetBasisMoistureFraction === 1
  )
    simpleError("moisture", "Moisture below one required.");
  const ashTracerDryMatterRetentionFraction =
    input.initialDryAshFraction / input.finalDryAshFraction;
  return {
    ashTracerDryMatterRetentionFraction,
    signedDryMatterLossPercent: 100 * (1 - ashTracerDryMatterRetentionFraction),
    modelFinalInitialWetMassRatio:
      (ashTracerDryMatterRetentionFraction *
        (1 - input.initialWetBasisMoistureFraction)) /
      (1 - input.finalWetBasisMoistureFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialDryAshFraction: 0.05,
  finalDryAshFraction: 0.1,
  initialWetBasisMoistureFraction: 0.2,
  finalWetBasisMoistureFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  ashTracerDryMatterRetentionFraction: 0.5,
  signedDryMatterLossPercent: 50,
  modelFinalInitialWetMassRatio: 0.4444444444444444,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/storage-loss-percentage",
  title: "Agriculture Storage Loss Percentage",
  description:
    "Infer storage dry-matter retention from an explicitly assumed conserved ash tracer, separating moisture-driven wet-mass ratio; ash loss/addition violates the model and apparent negative loss is retained as diagnostic.",
  inputs: inputFields,
  outputs: [
    {
      id: "ashTracerDryMatterRetentionFraction",
      label: "Ash tracer dry matter retention fraction",
      kind: "number",
    },
    {
      id: "signedDryMatterLossPercent",
      label: "Signed dry matter loss percent",
      kind: "number",
    },
    {
      id: "modelFinalInitialWetMassRatio",
      label: "Model final initial wet mass ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialDryAshFraction: value.initialDryAshFraction as number,
      finalDryAshFraction: value.finalDryAshFraction as number,
      initialWetBasisMoistureFraction:
        value.initialWetBasisMoistureFraction as number,
      finalWetBasisMoistureFraction:
        value.finalWetBasisMoistureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
