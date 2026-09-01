import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  safeText,
  catalogIndex,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerRelationshipClassIds: readonly string[];
  readonly callerVerifiedInterestEvidenceRequiredIds: readonly string[];
  readonly queryRelationshipClassId: string;
  readonly observedInterestEvidenceIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly callerRequiredInterestEvidenceId: string;
  readonly callerRequiredInterestEvidencePresent: boolean;
}>;
const inputFields = [
  {
    id: "callerRelationshipClassIds",
    label: "Caller relationship class ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInterestEvidenceRequiredIds",
    label: "Caller verified interest evidence required ids",
    kind: "stringList",
  },
  {
    id: "queryRelationshipClassId",
    label: "Query relationship class id",
    kind: "string",
  },
  {
    id: "observedInterestEvidenceIds",
    label: "Observed interest evidence ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerRelationshipClassIds, "relationships");
  aligned(
    input.callerRelationshipClassIds,
    input.callerVerifiedInterestEvidenceRequiredIds,
    "catalog",
  );
  unique(input.observedInterestEvidenceIds, "evidence");
  input.callerVerifiedInterestEvidenceRequiredIds.forEach((v) =>
    safeText(v, "requiredEvidence"),
  );
  const id =
    input.callerVerifiedInterestEvidenceRequiredIds[
      catalogIndex(
        input.callerRelationshipClassIds,
        input.queryRelationshipClassId,
      )
    ];
  return {
    callerRequiredInterestEvidenceId: id,
    callerRequiredInterestEvidencePresent:
      input.observedInterestEvidenceIds.includes(id),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRelationshipClassIds: ["family", "business"],
  callerVerifiedInterestEvidenceRequiredIds: [
    "family-proof",
    "financial-interest",
  ],
  queryRelationshipClassId: "business",
  observedInterestEvidenceIds: ["family-proof"],
} satisfies Input;
export const exampleOutput = {
  callerRequiredInterestEvidenceId: "financial-interest",
  callerRequiredInterestEvidencePresent: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/insurable-interest-relationship-checker",
  title: "Insurable Interest Relationship Checker",
  description:
    "Audit actual relationship-class evidence against caller independently verified required proof map; no relationship implies legal insurable interest automatically and no eligibility/legal verdict.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRequiredInterestEvidenceId",
      label: "Caller required interest evidence id",
      kind: "string",
    },
    {
      id: "callerRequiredInterestEvidencePresent",
      label: "Caller required interest evidence present",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRelationshipClassIds:
        value.callerRelationshipClassIds as readonly string[],
      callerVerifiedInterestEvidenceRequiredIds:
        value.callerVerifiedInterestEvidenceRequiredIds as readonly string[],
      queryRelationshipClassId: value.queryRelationshipClassId as string,
      observedInterestEvidenceIds:
        value.observedInterestEvidenceIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
