import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVeterinarianPrescribedDrugMassMg: number;
  readonly verifiedProductDrugMgPerMl: number;
  readonly actualRecordedAdministeredVolumeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVeterinarianPrescribedDrugMassMg",
    label: "Caller veterinarian prescribed drug mass mg",
    kind: "number",
  },
  {
    id: "verifiedProductDrugMgPerMl",
    label: "Verified product drug mg per ml",
    kind: "number",
  },
  {
    id: "actualRecordedAdministeredVolumeMl",
    label: "Actual recorded administered volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerVeterinarianPrescribedDrugMassMg, "prescribed-mass");
  positive(input.verifiedProductDrugMgPerMl, "verified-product");
  nonnegative(input.actualRecordedAdministeredVolumeMl, "actual-volume");
  const v =
    input.callerVeterinarianPrescribedDrugMassMg /
    input.verifiedProductDrugMgPerMl;
  return {
    conditionalPrescribedProductVolumeMl: v,
    signedActualMinusPrescribedVolumeMl:
      input.actualRecordedAdministeredVolumeMl - v,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVeterinarianPrescribedDrugMassMg: 10,
    verifiedProductDrugMgPerMl: 2,
    actualRecordedAdministeredVolumeMl: 4,
  },
  output: {
    result: {
      conditionalPrescribedProductVolumeMl: 5,
      signedActualMinusPrescribedVolumeMl: -1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/drug-dose-volume-from-concentration",
  title: "Dose Volume From Concentration Calculator",
  description:
    "Independently veterinarian prescribed drug mass divided by actual verified product mg/mL, compared with actual recorded administered volume. Not choose dose, concentration, route or safe administration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
