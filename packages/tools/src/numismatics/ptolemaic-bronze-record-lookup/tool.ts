import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly denominationLabels: readonly string[];
  readonly recordIds: readonly string[];
  readonly referenceWeightsGrams: readonly number[];
  readonly references: readonly string[];
  readonly queryRecordId: string;
}>;
export type Output = Readonly<{
  readonly denominationLabel: string;
  readonly recordId: string;
  readonly reference: string;
  readonly referenceWeightGrams: number;
}>;

export const calculate = (input: Input): Output => {
  const length = input.recordIds.length;
  if (
    length === 0 ||
    input.denominationLabels.length !== length ||
    input.referenceWeightsGrams.length !== length ||
    input.references.length !== length
  )
    simpleError(
      "recordIds",
      "All record columns must be nonempty and equal in length.",
      "record_length_mismatch",
    );
  if (
    input.referenceWeightsGrams.some(
      (value) => !Number.isFinite(value) || value <= 0,
    )
  )
    simpleError(
      "referenceWeightsGrams",
      "Reference weights must be finite and positive.",
      "invalid_weight",
    );
  const index = input.recordIds.indexOf(input.queryRecordId);
  if (index < 0)
    simpleError(
      "queryRecordId",
      "Record is absent from the caller-supplied table.",
      "record_not_found",
    );
  const denominationLabel = input.denominationLabels[index];
  const reference = input.references[index];
  const referenceWeightGrams = input.referenceWeightsGrams[index];
  if (
    denominationLabel === undefined ||
    reference === undefined ||
    referenceWeightGrams === undefined
  )
    simpleError(
      "recordIds",
      "Matching record is incomplete.",
      "record_incomplete",
    );
  return {
    denominationLabel,
    recordId: input.queryRecordId,
    reference,
    referenceWeightGrams,
  };
};

export const example = {
  input: {
    denominationLabels: ["Caller series A", "Caller series B"],
    recordIds: ["A", "B"],
    referenceWeightsGrams: [10, 20],
    references: ["Catalogue A", "Catalogue B"],
    queryRecordId: "B",
  },
  output: {
    denominationLabel: "Caller series B",
    recordId: "B",
    reference: "Catalogue B",
    referenceWeightGrams: 20,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    denominationLabels: ["Only record"],
    recordIds: ["X"],
    referenceWeightsGrams: [5],
    references: ["Caller reference"],
    queryRecordId: "X",
  },
  output: {
    denominationLabel: "Only record",
    recordId: "X",
    reference: "Caller reference",
    referenceWeightGrams: 5,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      denominationLabels: input.denominationLabels as string[],
      recordIds: input.recordIds as string[],
      referenceWeightsGrams: input.referenceWeightsGrams as number[],
      references: input.references as string[],
      queryRecordId: input.queryRecordId as string,
    }),
  description:
    "Retrieve a caller-supplied Ptolemaic bronze denomination record by identifier while preserving its weight standard and catalogue reference.",
  id: "numismatics/ptolemaic-bronze-record-lookup",
  inputs: [
    {
      id: "denominationLabels",
      kind: "stringList",
      label: "Denomination labels",
    },
    { id: "recordIds", kind: "stringList", label: "Record identifiers" },
    {
      id: "referenceWeightsGrams",
      kind: "numberList",
      label: "Reference weights",
      unit: "g",
    },
    { id: "references", kind: "stringList", label: "Catalogue references" },
    { id: "queryRecordId", kind: "string", label: "Query record identifier" },
  ],
  outputs: [
    { id: "denominationLabel", kind: "string", label: "Denomination label" },
    { id: "recordId", kind: "string", label: "Record identifier" },
    { id: "reference", kind: "string", label: "Catalogue reference" },
    {
      id: "referenceWeightGrams",
      kind: "number",
      label: "Reference weight",
      minimum: 0,
      unit: "g",
    },
  ],
  title: "Ptolemaic Bronze Record Lookup",
});

export const run = tool.execute;
export default tool;
