import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVeterinarianEstablishedRecipientBloodVolumeMl: number;
  readonly actualRecipientPcvFraction: number;
  readonly callerVeterinarianEstablishedTargetPcvFraction: number;
  readonly verifiedDonorProductPcvFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVeterinarianEstablishedRecipientBloodVolumeMl",
    label: "Caller veterinarian established recipient blood volume ml",
    kind: "number",
  },
  {
    id: "actualRecipientPcvFraction",
    label: "Actual recipient pcv fraction",
    kind: "number",
  },
  {
    id: "callerVeterinarianEstablishedTargetPcvFraction",
    label: "Caller veterinarian established target pcv fraction",
    kind: "number",
  },
  {
    id: "verifiedDonorProductPcvFraction",
    label: "Verified donor product pcv fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerVeterinarianEstablishedRecipientBloodVolumeMl,
    "bloodvolume",
  );
  [
    input.actualRecipientPcvFraction,
    input.callerVeterinarianEstablishedTargetPcvFraction,
    input.verifiedDonorProductPcvFraction,
  ].forEach((v) => fraction(v, "PCVfraction"));
  positive(input.verifiedDonorProductPcvFraction, "donorPCV");
  return {
    conditionalSimplifiedReplacementVolumeMl:
      (input.callerVeterinarianEstablishedRecipientBloodVolumeMl *
        (input.callerVeterinarianEstablishedTargetPcvFraction -
          input.actualRecipientPcvFraction)) /
      input.verifiedDonorProductPcvFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVeterinarianEstablishedRecipientBloodVolumeMl: 1000,
    actualRecipientPcvFraction: 0.2,
    callerVeterinarianEstablishedTargetPcvFraction: 0.3,
    verifiedDonorProductPcvFraction: 0.6,
  },
  output: {
    result: { conditionalSimplifiedReplacementVolumeMl: 166.66666666666666 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/packed-cell-volume-transfusion-target",
  title: "PCV Transfusion Target Calculator",
  description:
    "Declared simplified RBCdeficit replacement model bloodvolume\u00d7(target\u2212actualPCV)/donorPCV, fractions not percentages, assuming stipulated constant recipient volume/no loss. Not an expanded-volume mixing model, achieved PCVprediction, transfusion prescription or safety approval; clinician independently establishes product/target/applicability.",
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
