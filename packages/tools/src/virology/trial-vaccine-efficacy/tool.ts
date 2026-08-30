import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly vaccinatedCases: number;
  readonly vaccinatedParticipants: number;
  readonly controlCases: number;
  readonly controlParticipants: number;
}>;
export type Output = Readonly<{
  readonly vaccinatedAttackFraction: number;
  readonly controlAttackFraction: number;
  readonly riskRatio: number;
  readonly vaccineEfficacyPercent: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.vaccinatedCases, "vaccinatedCases");
  count(input.vaccinatedParticipants, "vaccinatedParticipants", 1);
  count(input.controlCases, "controlCases", 1);
  count(input.controlParticipants, "controlParticipants", 1);
  if (
    input.vaccinatedCases > input.vaccinatedParticipants ||
    input.controlCases > input.controlParticipants
  )
    simpleError(
      "vaccinatedCases",
      "Case counts cannot exceed trial-arm participants.",
    );
  const vaccinatedAttackFraction =
      input.vaccinatedCases / input.vaccinatedParticipants,
    controlAttackFraction = input.controlCases / input.controlParticipants,
    riskRatio = vaccinatedAttackFraction / controlAttackFraction;
  return {
    vaccinatedAttackFraction,
    controlAttackFraction,
    riskRatio,
    vaccineEfficacyPercent: 100 * (1 - riskRatio),
  };
};
export const exampleInput = {
  vaccinatedCases: 10,
  vaccinatedParticipants: 1000,
  controlCases: 40,
  controlParticipants: 1000,
} satisfies Input;
export const exampleOutput = {
  vaccinatedAttackFraction: 0.01,
  controlAttackFraction: 0.04,
  riskRatio: 0.25,
  vaccineEfficacyPercent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/trial-vaccine-efficacy",
  title: "Trial Vaccine Efficacy",
  description:
    "Compute attack-risk vaccine efficacy from two trial arms; negative efficacy is retained, not clipped.",
  inputs: [
    {
      id: "vaccinatedCases",
      label: "Vaccinated cases",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "vaccinatedParticipants",
      label: "Vaccinated participants",
      kind: "integer",
      minimum: 1,
    },
    { id: "controlCases", label: "Control cases", kind: "integer", minimum: 1 },
    {
      id: "controlParticipants",
      label: "Control participants",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "vaccinatedAttackFraction",
      label: "Vaccinated attack fraction",
      kind: "number",
    },
    {
      id: "controlAttackFraction",
      label: "Control attack fraction",
      kind: "number",
    },
    { id: "riskRatio", label: "Risk ratio", kind: "number" },
    {
      id: "vaccineEfficacyPercent",
      label: "Vaccine efficacy percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      vaccinatedCases: value.vaccinatedCases as number,
      vaccinatedParticipants: value.vaccinatedParticipants as number,
      controlCases: value.controlCases as number,
      controlParticipants: value.controlParticipants as number,
    }),
});
export const run = tool.execute;
export default tool;
