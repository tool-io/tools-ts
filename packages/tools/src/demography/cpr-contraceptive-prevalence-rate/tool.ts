import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CprContraceptivePrevalenceRateInput = {
  readonly currentUsers: number;
  readonly womenOfReproductiveAge: number;
};

export type CprContraceptivePrevalenceRateOutput = {
  readonly contraceptivePrevalenceRatePercent: number;
};

export const calculateCprContraceptivePrevalenceRate = (
  input: CprContraceptivePrevalenceRateInput,
): CprContraceptivePrevalenceRateOutput => {
  if (!(input.currentUsers >= 0))
    return simpleError(
      "currentUsers",
      "The count of current users must be non-negative.",
      "invalid_count",
    );
  if (!(input.womenOfReproductiveAge > 0))
    return simpleError(
      "womenOfReproductiveAge",
      "The base of women of reproductive age must be greater than zero.",
      "invalid_base",
    );
  if (input.currentUsers > input.womenOfReproductiveAge)
    return simpleError(
      "currentUsers",
      "Current users cannot exceed the base population.",
      "invalid_count",
    );
  return {
    contraceptivePrevalenceRatePercent:
      (input.currentUsers / input.womenOfReproductiveAge) * 100,
  };
};

export const cprContraceptivePrevalenceRateExample = {
  input: { currentUsers: 5850000, womenOfReproductiveAge: 9000000 },
  output: { contraceptivePrevalenceRatePercent: 65 },
} satisfies ToolExample<
  CprContraceptivePrevalenceRateInput,
  CprContraceptivePrevalenceRateOutput
>;

export const cprContraceptivePrevalenceRateTool = createSimpleTool({
  id: "demography/cpr-contraceptive-prevalence-rate",
  title: "CPR Contraceptive Prevalence Rate",
  description:
    "Compute the contraceptive prevalence rate as the percent of women in the reference base (usually married women aged 15-49) currently using any contraceptive method.",
  inputs: [
    {
      description: "Women in the reference base currently using any method.",
      id: "currentUsers",
      kind: "number",
      label: "Users",
      minimum: 0,
    },
    {
      description: "Total women in the reference base.",
      id: "womenOfReproductiveAge",
      kind: "number",
      label: "Base women",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Contraceptive prevalence rate in percent.",
      id: "contraceptivePrevalenceRatePercent",
      kind: "number",
      label: "CPR %",
    },
  ],
  calculate: (input) =>
    calculateCprContraceptivePrevalenceRate(
      input as unknown as CprContraceptivePrevalenceRateInput,
    ),
});

export const runCprContraceptivePrevalenceRate =
  cprContraceptivePrevalenceRateTool.execute;
export default cprContraceptivePrevalenceRateTool;
