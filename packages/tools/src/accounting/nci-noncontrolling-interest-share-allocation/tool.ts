import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  bounded,
  weightedMinor,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly subsidiaryReportedProfitMinor: number;
  readonly signedConsolidationProfitAdjustmentsMinor: readonly number[];
  readonly subsidiaryOciMinor: number;
  readonly callerNciOwnershipBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly adjustedSubsidiaryProfitMinor: number;
  readonly nciProfitMinor: number;
  readonly parentProfitMinor: number;
  readonly nciOciMinor: number;
  readonly parentOciMinor: number;
}>;
const inputFields = [
  {
    id: "subsidiaryReportedProfitMinor",
    label: "Subsidiary reported profit minor",
    kind: "number",
  },
  {
    id: "signedConsolidationProfitAdjustmentsMinor",
    label: "Signed consolidation profit adjustments minor",
    kind: "numberList",
  },
  { id: "subsidiaryOciMinor", label: "Subsidiary oci minor", kind: "number" },
  {
    id: "callerNciOwnershipBasisPoints",
    label: "Caller nci ownership basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  integer(input.subsidiaryReportedProfitMinor, "subsidiaryReportedProfitMinor");
  input.signedConsolidationProfitAdjustmentsMinor.forEach((v) =>
    integer(v, "signedConsolidationProfitAdjustmentsMinor"),
  );
  integer(input.subsidiaryOciMinor, "subsidiaryOciMinor");
  bounded(input.callerNciOwnershipBasisPoints, "ownership", 0, 10000);
  const profit = signedSum([
      input.subsidiaryReportedProfitMinor,
      ...input.signedConsolidationProfitAdjustmentsMinor,
    ]),
    nci = weightedMinor(profit, input.callerNciOwnershipBasisPoints, 10000),
    oci = weightedMinor(
      input.subsidiaryOciMinor,
      input.callerNciOwnershipBasisPoints,
      10000,
    );
  return {
    adjustedSubsidiaryProfitMinor: profit,
    nciProfitMinor: nci,
    parentProfitMinor: profit - nci,
    nciOciMinor: oci,
    parentOciMinor: integer(input.subsidiaryOciMinor - oci, "parentOci"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  subsidiaryReportedProfitMinor: 500,
  signedConsolidationProfitAdjustmentsMinor: [-100],
  subsidiaryOciMinor: 80,
  callerNciOwnershipBasisPoints: 2500,
} satisfies Input;
export const exampleOutput = {
  adjustedSubsidiaryProfitMinor: 400,
  nciProfitMinor: 100,
  parentProfitMinor: 300,
  nciOciMinor: 20,
  parentOciMinor: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/nci-noncontrolling-interest-share-allocation",
  title: "NCI Noncontrolling Interest Share Allocation Calculator",
  description:
    "Allocate caller adjusted subsidiary profit and OCI to NCI/parent at explicit ownership share with half-away-from-zero minor rounding; no voting-control test, acquisition timing or attribution of upstream/downstream eliminations inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "adjustedSubsidiaryProfitMinor",
      label: "Adjusted subsidiary profit minor",
      kind: "number",
    },
    { id: "nciProfitMinor", label: "Nci profit minor", kind: "number" },
    { id: "parentProfitMinor", label: "Parent profit minor", kind: "number" },
    { id: "nciOciMinor", label: "Nci oci minor", kind: "number" },
    { id: "parentOciMinor", label: "Parent oci minor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      subsidiaryReportedProfitMinor:
        value.subsidiaryReportedProfitMinor as number,
      signedConsolidationProfitAdjustmentsMinor:
        value.signedConsolidationProfitAdjustmentsMinor as readonly number[],
      subsidiaryOciMinor: value.subsidiaryOciMinor as number,
      callerNciOwnershipBasisPoints:
        value.callerNciOwnershipBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
