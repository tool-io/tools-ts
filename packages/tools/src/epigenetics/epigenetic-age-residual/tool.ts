import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly epigeneticAgeYears: number;
  readonly chronologicalAgeYears: number;
  readonly residualStdDevYears: number;
}>;
export type Output = Readonly<{
  readonly ageResidualYears: number;
  readonly standardizedResidual: number;
  readonly class: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.residualStdDevYears <= 0)
    simpleError(
      "residualStdDevYears",
      "Standard deviation must be positive.",
      "invalid_scale",
    );
  const ageResidualYears =
      input.epigeneticAgeYears - input.chronologicalAgeYears,
    standardizedResidual = ageResidualYears / input.residualStdDevYears;
  return {
    ageResidualYears,
    standardizedResidual,
    class:
      standardizedResidual > 1
        ? "accelerated"
        : standardizedResidual < -1
          ? "decelerated"
          : "typical",
  };
};

export const exampleInput = {
  epigeneticAgeYears: 60,
  chronologicalAgeYears: 50,
  residualStdDevYears: 5,
} satisfies Input;
export const exampleOutput = {
  ageResidualYears: 10,
  standardizedResidual: 2,
  class: "accelerated",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      epigeneticAgeYears: input.epigeneticAgeYears as number,
      chronologicalAgeYears: input.chronologicalAgeYears as number,
      residualStdDevYears: input.residualStdDevYears as number,
    }),
  description: "Calculate and classify epigenetic age acceleration.",
  id: "epigenetics/epigenetic-age-residual",
  inputs: [
    {
      id: "epigeneticAgeYears",
      label: "Epigenetic age",
      kind: "number",
      minimum: 0,
    },
    {
      id: "chronologicalAgeYears",
      label: "Chronological age",
      kind: "number",
      minimum: 0,
    },
    {
      id: "residualStdDevYears",
      label: "Residual standard deviation",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "ageResidualYears", label: "Age residual", kind: "number" },
    {
      id: "standardizedResidual",
      label: "Standardized residual",
      kind: "number",
    },
    {
      id: "class",
      label: "Acceleration class",
      kind: "string",
      enum: ["decelerated", "typical", "accelerated"],
    },
  ],
  title: "Epigenetic Age Residual",
});

export const run = tool.execute;
export default tool;
