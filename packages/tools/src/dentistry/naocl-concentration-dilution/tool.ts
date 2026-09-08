import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly verifiedStockConcentrationPercent: number;
  readonly callerClinicianSpecifiedTargetConcentrationPercent: number;
  readonly callerClinicianSpecifiedFinalVolumeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedStockConcentrationPercent",
    label: "Verified stock concentration percent",
    kind: "number",
  },
  {
    id: "callerClinicianSpecifiedTargetConcentrationPercent",
    label: "Caller clinician specified target concentration percent",
    kind: "number",
  },
  {
    id: "callerClinicianSpecifiedFinalVolumeMl",
    label: "Caller clinician specified final volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.verifiedStockConcentrationPercent, "stock");
  nonnegative(
    input.callerClinicianSpecifiedTargetConcentrationPercent,
    "target",
  );
  positive(input.callerClinicianSpecifiedFinalVolumeMl, "volume");
  if (
    input.verifiedStockConcentrationPercent > 100 ||
    input.callerClinicianSpecifiedTargetConcentrationPercent >
      input.verifiedStockConcentrationPercent
  )
    simpleError(
      "concentration",
      "Compatible percentbasis target within stock; no enrichment.",
    );
  const v =
    (input.callerClinicianSpecifiedFinalVolumeMl *
      input.callerClinicianSpecifiedTargetConcentrationPercent) /
    input.verifiedStockConcentrationPercent;
  return {
    conditionalStockVolumeMl: v,
    conditionalDiluentVolumeMl: input.callerClinicianSpecifiedFinalVolumeMl - v,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedStockConcentrationPercent: 5,
    callerClinicianSpecifiedTargetConcentrationPercent: 1,
    callerClinicianSpecifiedFinalVolumeMl: 100,
  },
  output: {
    result: { conditionalStockVolumeMl: 20, conditionalDiluentVolumeMl: 80 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/naocl-concentration-dilution",
  title: "NaOCl Concentration Dilution Calculator",
  description:
    "Ideal same-basis NaOCldilution arithmetic C1V1=C2V2for independently clinician-specified target and verified compatible stock. No mixing instruction, stability/interaction guarantee, disinfection efficacy or patient-use recommendation.",
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
