import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  weightedMinor,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly applicantAgeYears: number;
  readonly callerExclusiveMaximumRushAge: number;
  readonly callerEvidenceVerified: boolean;
  readonly baseTicketPriceMinor: number;
  readonly callerRushDiscountBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly callerRushEligibilitySatisfied: boolean;
  readonly roundedApplicableRushPriceMinor: number;
}>;
const inputFields = [
  { id: "applicantAgeYears", label: "Applicant age years", kind: "number" },
  {
    id: "callerExclusiveMaximumRushAge",
    label: "Caller exclusive maximum rush age",
    kind: "number",
  },
  {
    id: "callerEvidenceVerified",
    label: "Caller evidence verified",
    kind: "boolean",
  },
  {
    id: "baseTicketPriceMinor",
    label: "Base ticket price minor",
    kind: "number",
  },
  {
    id: "callerRushDiscountBasisPoints",
    label: "Caller rush discount basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.applicantAgeYears, "age", 0, 120);
  bounded(input.callerExclusiveMaximumRushAge, "maximum", 1, 121);
  bounded(input.baseTicketPriceMinor, "price", 0, 1000000000);
  bounded(input.callerRushDiscountBasisPoints, "discount", 0, 10000);
  const eligible =
    input.callerEvidenceVerified &&
    input.applicantAgeYears < input.callerExclusiveMaximumRushAge;
  return {
    callerRushEligibilitySatisfied: eligible,
    roundedApplicableRushPriceMinor: eligible
      ? weightedMinor(
          input.baseTicketPriceMinor,
          10000 - input.callerRushDiscountBasisPoints,
          10000,
        )
      : input.baseTicketPriceMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  applicantAgeYears: 29,
  callerExclusiveMaximumRushAge: 30,
  callerEvidenceVerified: true,
  baseTicketPriceMinor: 1000,
  callerRushDiscountBasisPoints: 5000,
} satisfies Input;
export const exampleOutput = {
  callerRushEligibilitySatisfied: true,
  roundedApplicableRushPriceMinor: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/rush-ticket-under-30-discount-lookup",
  title: "Rush Ticket Under 30 Discount Lookup",
  description:
    "Screen actual verified age evidence against caller exclusive rush age policy and supplied discount; no automatic identity verification, universal under-30 entitlement or eligibility law determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRushEligibilitySatisfied",
      label: "Caller rush eligibility satisfied",
      kind: "boolean",
    },
    {
      id: "roundedApplicableRushPriceMinor",
      label: "Rounded applicable rush price minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      applicantAgeYears: value.applicantAgeYears as number,
      callerExclusiveMaximumRushAge:
        value.callerExclusiveMaximumRushAge as number,
      callerEvidenceVerified: value.callerEvidenceVerified as boolean,
      baseTicketPriceMinor: value.baseTicketPriceMinor as number,
      callerRushDiscountBasisPoints:
        value.callerRushDiscountBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
