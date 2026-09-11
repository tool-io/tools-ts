import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVeterinarianEstablishedDonorBloodVolumeMl: number;
  readonly callerVeterinarianApplicableCollectionFraction: number;
  readonly actualRecordedCollectedMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVeterinarianEstablishedDonorBloodVolumeMl",
    label: "Caller veterinarian established donor blood volume ml",
    kind: "number",
  },
  {
    id: "callerVeterinarianApplicableCollectionFraction",
    label: "Caller veterinarian applicable collection fraction",
    kind: "number",
  },
  {
    id: "actualRecordedCollectedMl",
    label: "Actual recorded collected ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerVeterinarianEstablishedDonorBloodVolumeMl,
    "independent-volume",
  );
  fraction(
    input.callerVeterinarianApplicableCollectionFraction,
    "independent-fraction",
  );
  nonnegative(input.actualRecordedCollectedMl, "actual");
  const c =
    input.callerVeterinarianEstablishedDonorBloodVolumeMl *
    input.callerVeterinarianApplicableCollectionFraction;
  return {
    conditionalCallerCollectionCeilingMl: c,
    signedRemainingCallerCeilingMl: c - input.actualRecordedCollectedMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVeterinarianEstablishedDonorBloodVolumeMl: 1000,
    callerVeterinarianApplicableCollectionFraction: 0.1,
    actualRecordedCollectedMl: 80,
  },
  output: {
    result: {
      conditionalCallerCollectionCeilingMl: 100,
      signedRemainingCallerCeilingMl: 20,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/donor-blood-collection-limit",
  title: "Donor Blood Collection Limit Calculator",
  description:
    "Independent veterinarian donor-volume\u00d7independently applicable collection fraction versus actual collected volume. Not universal donor limit, donor eligibility, safe collection or permission to draw blood.",
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
