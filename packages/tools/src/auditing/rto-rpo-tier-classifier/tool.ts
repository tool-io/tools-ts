import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rtoHours: number;
  readonly rpoHours: number;
  readonly tierOneMaxRtoHours: number;
  readonly tierOneMaxRpoHours: number;
  readonly tierTwoMaxRtoHours: number;
  readonly tierTwoMaxRpoHours: number;
}>;
export type Output = Readonly<{
  readonly tier: string;
  readonly meetsTierOne: boolean;
  readonly meetsTierTwo: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.tierOneMaxRtoHours > input.tierTwoMaxRtoHours ||
    input.tierOneMaxRpoHours > input.tierTwoMaxRpoHours
  )
    simpleError(
      "tierOneMaxRtoHours",
      "Tier-one limits cannot be looser than tier two.",
      "invalid_tiers",
    );
  const meetsTierOne =
    input.rtoHours <= input.tierOneMaxRtoHours &&
    input.rpoHours <= input.tierOneMaxRpoHours;
  const meetsTierTwo =
    input.rtoHours <= input.tierTwoMaxRtoHours &&
    input.rpoHours <= input.tierTwoMaxRpoHours;
  return {
    tier: meetsTierOne ? "tier-one" : meetsTierTwo ? "tier-two" : "tier-three",
    meetsTierOne,
    meetsTierTwo,
  };
};

export const exampleInput = {
  rtoHours: 2,
  rpoHours: 1,
  tierOneMaxRtoHours: 1,
  tierOneMaxRpoHours: 0.5,
  tierTwoMaxRtoHours: 4,
  tierTwoMaxRpoHours: 2,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  rtoHours: 8,
  rpoHours: 4,
  tierOneMaxRtoHours: 1,
  tierOneMaxRpoHours: 0.5,
  tierTwoMaxRtoHours: 4,
  tierTwoMaxRpoHours: 2,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rtoHours: input.rtoHours as number,
      rpoHours: input.rpoHours as number,
      tierOneMaxRtoHours: input.tierOneMaxRtoHours as number,
      tierOneMaxRpoHours: input.tierOneMaxRpoHours as number,
      tierTwoMaxRtoHours: input.tierTwoMaxRtoHours as number,
      tierTwoMaxRpoHours: input.tierTwoMaxRpoHours as number,
    }),
  description:
    "Classify RTO and RPO against caller-defined application-tier limits.",
  id: "auditing/rto-rpo-tier-classifier",
  inputs: [
    {
      id: "rtoHours",
      label: "Recovery time objective",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "rpoHours",
      label: "Recovery point objective",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "tierOneMaxRtoHours",
      label: "Tier-one maximum RTO",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "tierOneMaxRpoHours",
      label: "Tier-one maximum RPO",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "tierTwoMaxRtoHours",
      label: "Tier-two maximum RTO",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "tierTwoMaxRpoHours",
      label: "Tier-two maximum RPO",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      id: "tier",
      label: "Application tier",
      kind: "string",
      enum: ["tier-one", "tier-two", "tier-three"],
    },
    { id: "meetsTierOne", label: "Meets tier-one limits", kind: "boolean" },
    { id: "meetsTierTwo", label: "Meets tier-two limits", kind: "boolean" },
  ],
  title: "RTO/RPO Tier Classifier",
});

export const run = tool.execute;
export default tool;
