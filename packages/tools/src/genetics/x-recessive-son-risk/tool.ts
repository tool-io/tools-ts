import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction } from "../shared.js";

export type Input = Readonly<{
  readonly motherCarrierProbability: number;
  readonly maleBirthProbability: number;
  readonly penetranceFraction: number;
}>;
export type Output = Readonly<{
  readonly affectedGivenSonProbability: number;
  readonly affectedSonPerBirthProbability: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.motherCarrierProbability, "motherCarrierProbability");
  fraction(input.maleBirthProbability, "maleBirthProbability");
  fraction(input.penetranceFraction, "penetranceFraction");
  const affectedGivenSonProbability =
    input.motherCarrierProbability * 0.5 * input.penetranceFraction;
  return {
    affectedGivenSonProbability,
    affectedSonPerBirthProbability:
      affectedGivenSonProbability * input.maleBirthProbability,
  };
};
export const exampleInput = {
  motherCarrierProbability: 1,
  maleBirthProbability: 0.5,
  penetranceFraction: 1,
} satisfies Input;
export const exampleOutput = {
  affectedGivenSonProbability: 0.5,
  affectedSonPerBirthProbability: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/x-recessive-son-risk",
  title: "X Recessive Son Risk",
  description:
    "Compute an X-recessive carrier-mother son-risk model with explicit carrier prior, birth sex probability, and penetrance.",
  inputs: [
    {
      id: "motherCarrierProbability",
      label: "Mother carrier probability",
      kind: "number",
    },
    {
      id: "maleBirthProbability",
      label: "Male birth probability",
      kind: "number",
    },
    { id: "penetranceFraction", label: "Penetrance fraction", kind: "number" },
  ],
  outputs: [
    {
      id: "affectedGivenSonProbability",
      label: "Affected given son probability",
      kind: "number",
    },
    {
      id: "affectedSonPerBirthProbability",
      label: "Affected son per birth probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      motherCarrierProbability: value.motherCarrierProbability as number,
      maleBirthProbability: value.maleBirthProbability as number,
      penetranceFraction: value.penetranceFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
