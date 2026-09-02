import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  unique,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHingeSetIds: readonly string[];
  readonly callerMatchedFullSetMassLimitsKg: readonly number[];
  readonly callerMatchedDoorWidthLimitsMm: readonly number[];
  readonly callerIndependentInstallationVerifiedFlags: readonly number[];
  readonly observedDoorMassKg: number;
  readonly observedDoorWidthMm: number;
}>;
export type Output = Readonly<{
  readonly compatibleVerifiedHingeSetIds: readonly string[];
  readonly unknownInstallationCandidateIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerVerifiedHingeSetIds",
    label: "Caller verified hinge set ids",
    kind: "stringList",
  },
  {
    id: "callerMatchedFullSetMassLimitsKg",
    label: "Caller matched full set mass limits kg",
    kind: "numberList",
  },
  {
    id: "callerMatchedDoorWidthLimitsMm",
    label: "Caller matched door width limits mm",
    kind: "numberList",
  },
  {
    id: "callerIndependentInstallationVerifiedFlags",
    label: "Caller independent installation verified flags",
    kind: "numberList",
  },
  { id: "observedDoorMassKg", label: "Observed door mass kg", kind: "number" },
  {
    id: "observedDoorWidthMm",
    label: "Observed door width mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedFullSetMassLimitsKg.forEach((v) =>
    nonnegative(v, "callerMatchedFullSetMassLimitsKg"),
  );
  input.callerMatchedDoorWidthLimitsMm.forEach((v) =>
    nonnegative(v, "callerMatchedDoorWidthLimitsMm"),
  );
  nonnegative(input.observedDoorMassKg, "observedDoorMassKg");
  nonnegative(input.observedDoorWidthMm, "observedDoorWidthMm");
  binary(
    input.callerIndependentInstallationVerifiedFlags,
    "callerIndependentInstallationVerifiedFlags",
  );
  aligned(
    input.callerVerifiedHingeSetIds,
    input.callerMatchedFullSetMassLimitsKg,
    "callerVerifiedHingeSetIds",
  );
  aligned(
    input.callerVerifiedHingeSetIds,
    input.callerMatchedDoorWidthLimitsMm,
    "callerVerifiedHingeSetIds",
  );
  aligned(
    input.callerVerifiedHingeSetIds,
    input.callerIndependentInstallationVerifiedFlags,
    "callerVerifiedHingeSetIds",
  );
  unique(input.callerVerifiedHingeSetIds, "sets");
  const fit = input.callerVerifiedHingeSetIds.map(
    (_, i) =>
      input.observedDoorMassKg <= input.callerMatchedFullSetMassLimitsKg[i] &&
      input.observedDoorWidthMm <= input.callerMatchedDoorWidthLimitsMm[i],
  );
  return {
    compatibleVerifiedHingeSetIds: input.callerVerifiedHingeSetIds.filter(
      (_, i) => fit[i] && input.callerIndependentInstallationVerifiedFlags[i],
    ),
    unknownInstallationCandidateIds: input.callerVerifiedHingeSetIds.filter(
      (_, i) => fit[i] && !input.callerIndependentInstallationVerifiedFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHingeSetIds: ["a", "b"],
  callerMatchedFullSetMassLimitsKg: [10, 20],
  callerMatchedDoorWidthLimitsMm: [100, 200],
  callerIndependentInstallationVerifiedFlags: [1, 0],
  observedDoorMassKg: 15,
  observedDoorWidthMm: 150,
} satisfies Input;
export const exampleOutput = {
  compatibleVerifiedHingeSetIds: [],
  unknownInstallationCandidateIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/beschlag-tragkraft-scharnier-lookup",
  title: "Beschlag Tragkraft Scharnier Lookup",
  description:
    "Screen independently rated COMPLETE hinge sets against actual door mass AND width, exact installation verification separate; no adding individual hinge capacities, mass-only count lower bound or safety approval. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleVerifiedHingeSetIds",
      label: "Compatible verified hinge set ids",
      kind: "stringList",
    },
    {
      id: "unknownInstallationCandidateIds",
      label: "Unknown installation candidate ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedHingeSetIds:
        value.callerVerifiedHingeSetIds as readonly string[],
      callerMatchedFullSetMassLimitsKg:
        value.callerMatchedFullSetMassLimitsKg as readonly number[],
      callerMatchedDoorWidthLimitsMm:
        value.callerMatchedDoorWidthLimitsMm as readonly number[],
      callerIndependentInstallationVerifiedFlags:
        value.callerIndependentInstallationVerifiedFlags as readonly number[],
      observedDoorMassKg: value.observedDoorMassKg as number,
      observedDoorWidthMm: value.observedDoorWidthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
