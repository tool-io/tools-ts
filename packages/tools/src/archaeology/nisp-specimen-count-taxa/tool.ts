import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, ids } from "../shared.js";
export type Input = Readonly<{
  readonly taxonIds: readonly number[];
  readonly specimenTaxonIds: readonly number[];
  readonly excludedTaxonId: number;
}>;
export type Output = Readonly<{
  readonly nispCounts: readonly number[];
  readonly unassignedSpecimenCount: number;
  readonly totalSpecimenCount: number;
}>;
const inputFields = [
  { id: "taxonIds", label: "Taxon ids", kind: "numberList" },
  { id: "specimenTaxonIds", label: "Specimen taxon ids", kind: "numberList" },
  { id: "excludedTaxonId", label: "Excluded taxon id", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.specimenTaxonIds.forEach((v) => count(v, "specimenTaxonIds"));
  count(input.excludedTaxonId, "excludedTaxonId");
  ids(input.taxonIds, "taxonIds");
  if (input.taxonIds.includes(input.excludedTaxonId))
    simpleError(
      "excludedTaxonId",
      "Excluded/unassigned ID must not be a listed taxon.",
    );
  const index = new Map(input.taxonIds.map((v, i) => [v, i])),
    nispCounts = Array<number>(input.taxonIds.length).fill(0);
  let unassignedSpecimenCount = 0;
  input.specimenTaxonIds.forEach((v) => {
    if (v === input.excludedTaxonId) unassignedSpecimenCount++;
    else {
      const i = index.get(v);
      if (i === undefined)
        return simpleError(
          "specimenTaxonIds",
          "Unknown taxon ID must be explicitly listed or excluded.",
        );
      nispCounts[i]++;
    }
  });
  return {
    nispCounts,
    unassignedSpecimenCount,
    totalSpecimenCount: input.specimenTaxonIds.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  taxonIds: [1, 2],
  specimenTaxonIds: [1, 2, 1, 0],
  excludedTaxonId: 0,
} satisfies Input;
export const exampleOutput = {
  nispCounts: [2, 1],
  unassignedSpecimenCount: 1,
  totalSpecimenCount: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/nisp-specimen-count-taxa",
  title: "NISP Specimen Count By Taxa Tool",
  description:
    "Tabulate one taxon assignment per observed specimen while retaining explicitly unassigned records; fragmentation and element counts do not convert NISP to individuals.",
  inputs: inputFields,
  outputs: [
    { id: "nispCounts", label: "Nisp counts", kind: "numberList" },
    {
      id: "unassignedSpecimenCount",
      label: "Unassigned specimen count",
      kind: "number",
    },
    { id: "totalSpecimenCount", label: "Total specimen count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      taxonIds: value.taxonIds as readonly number[],
      specimenTaxonIds: value.specimenTaxonIds as readonly number[],
      excludedTaxonId: value.excludedTaxonId as number,
    }),
});
export const run = tool.execute;
export default tool;
