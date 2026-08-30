import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly vectorDensityPerHuman: number;
  readonly dailyBitesPerVector: number;
  readonly dailySurvivalFraction: number;
  readonly extrinsicIncubationDays: number;
}>;
export type Output = Readonly<{
  readonly vectorialCapacity: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.vectorDensityPerHuman, "vectorDensityPerHuman");
  nonnegative(input.dailyBitesPerVector, "dailyBitesPerVector");
  fraction(input.dailySurvivalFraction, "dailySurvivalFraction");
  positive(input.dailySurvivalFraction, "dailySurvivalFraction");
  if (input.dailySurvivalFraction === 1)
    simpleError(
      "dailySurvivalFraction",
      "Survival must be less than one for finite expected lifespan.",
    );
  nonnegative(input.extrinsicIncubationDays, "extrinsicIncubationDays");
  return {
    vectorialCapacity:
      (input.vectorDensityPerHuman *
        input.dailyBitesPerVector ** 2 *
        input.dailySurvivalFraction ** input.extrinsicIncubationDays) /
      -Math.log(input.dailySurvivalFraction),
  };
};
export const exampleInput = {
  vectorDensityPerHuman: 10,
  dailyBitesPerVector: 0.2,
  dailySurvivalFraction: 0.9,
  extrinsicIncubationDays: 10,
} satisfies Input;
export const exampleOutput = {
  vectorialCapacity: 1.3237537342067855,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/vectorial-capacity-model",
  title: "Vectorial Capacity Model",
  description:
    "Evaluate the classical vectorial capacity model m·a²·pⁿ/(−ln p) using explicit caller parameters.",
  inputs: [
    {
      id: "vectorDensityPerHuman",
      label: "Vector density per human",
      kind: "number",
    },
    {
      id: "dailyBitesPerVector",
      label: "Daily bites per vector",
      kind: "number",
    },
    {
      id: "dailySurvivalFraction",
      label: "Daily survival fraction",
      kind: "number",
    },
    {
      id: "extrinsicIncubationDays",
      label: "Extrinsic incubation days",
      kind: "number",
    },
  ],
  outputs: [
    { id: "vectorialCapacity", label: "Vectorial capacity", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      vectorDensityPerHuman: value.vectorDensityPerHuman as number,
      dailyBitesPerVector: value.dailyBitesPerVector as number,
      dailySurvivalFraction: value.dailySurvivalFraction as number,
      extrinsicIncubationDays: value.extrinsicIncubationDays as number,
    }),
});
export const run = tool.execute;
export default tool;
