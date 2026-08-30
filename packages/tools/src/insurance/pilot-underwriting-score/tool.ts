import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalFlightHours: number;
  readonly recentFlightHours: number;
  readonly aircraftComplexityScore: number;
  readonly incidentCount: number;
  readonly acceptableRiskScore: number;
}>;
export type Output = Readonly<{
  readonly experienceCredit: number;
  readonly underwritingRiskScore: number;
  readonly withinRiskLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const experienceCredit =
      Math.min(50, input.totalFlightHours / 100) +
      Math.min(20, input.recentFlightHours / 10),
    underwritingRiskScore = Math.max(
      0,
      input.aircraftComplexityScore +
        input.incidentCount * 25 -
        experienceCredit,
    );
  return {
    experienceCredit,
    underwritingRiskScore,
    withinRiskLimit: underwritingRiskScore <= input.acceptableRiskScore,
  };
};

export const exampleInput = {
  totalFlightHours: 1000,
  recentFlightHours: 100,
  aircraftComplexityScore: 60,
  incidentCount: 1,
  acceptableRiskScore: 60,
} satisfies Input;
export const exampleOutput = {
  experienceCredit: 20,
  underwritingRiskScore: 65,
  withinRiskLimit: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      totalFlightHours: input.totalFlightHours as number,
      recentFlightHours: input.recentFlightHours as number,
      aircraftComplexityScore: input.aircraftComplexityScore as number,
      incidentCount: input.incidentCount as number,
      acceptableRiskScore: input.acceptableRiskScore as number,
    }),
  description:
    "Score pilot underwriting risk from experience, aircraft complexity, and incidents.",
  id: "insurance/pilot-underwriting-score",
  inputs: [
    {
      id: "totalFlightHours",
      label: "Total flight hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "recentFlightHours",
      label: "Recent flight hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "aircraftComplexityScore",
      label: "Aircraft complexity score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "incidentCount",
      label: "Pilot incident count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "acceptableRiskScore",
      label: "Maximum acceptable score",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "experienceCredit",
      label: "Experience credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "underwritingRiskScore",
      label: "Underwriting risk score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "withinRiskLimit",
      label: "Within supplied risk limit",
      kind: "boolean",
    },
  ],
  title: "Pilot Underwriting Score",
});

export const run = tool.execute;
export default tool;
