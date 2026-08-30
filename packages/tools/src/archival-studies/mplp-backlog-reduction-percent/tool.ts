import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly openingBacklogLinearFeet: number;
  readonly newUnprocessedAccessionsLinearFeet: number;
  readonly processedBacklogLinearFeet: number;
  readonly scopeRemovedLinearFeet: number;
}>;
export type Output = Readonly<{
  readonly closingBacklogLinearFeet: number;
  readonly netBacklogReductionPercent: number;
  readonly processingOnlyOpeningBacklogReductionPercent: number;
}>;
const inputFields = [
  {
    id: "openingBacklogLinearFeet",
    label: "Opening backlog linear feet",
    kind: "number",
  },
  {
    id: "newUnprocessedAccessionsLinearFeet",
    label: "New unprocessed accessions linear feet",
    kind: "number",
  },
  {
    id: "processedBacklogLinearFeet",
    label: "Processed backlog linear feet",
    kind: "number",
  },
  {
    id: "scopeRemovedLinearFeet",
    label: "Scope removed linear feet",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.openingBacklogLinearFeet, "openingBacklogLinearFeet");
  nonnegative(
    input.newUnprocessedAccessionsLinearFeet,
    "newUnprocessedAccessionsLinearFeet",
  );
  nonnegative(input.processedBacklogLinearFeet, "processedBacklogLinearFeet");
  nonnegative(input.scopeRemovedLinearFeet, "scopeRemovedLinearFeet");
  const close = nonnegative(
    input.openingBacklogLinearFeet +
      input.newUnprocessedAccessionsLinearFeet -
      input.processedBacklogLinearFeet -
      input.scopeRemovedLinearFeet,
    "closingBacklog",
  );
  return {
    closingBacklogLinearFeet: close,
    netBacklogReductionPercent:
      (100 * (input.openingBacklogLinearFeet - close)) /
      input.openingBacklogLinearFeet,
    processingOnlyOpeningBacklogReductionPercent:
      (100 * input.processedBacklogLinearFeet) / input.openingBacklogLinearFeet,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingBacklogLinearFeet: 100,
  newUnprocessedAccessionsLinearFeet: 30,
  processedBacklogLinearFeet: 40,
  scopeRemovedLinearFeet: 10,
} satisfies Input;
export const exampleOutput = {
  closingBacklogLinearFeet: 80,
  netBacklogReductionPercent: 20,
  processingOnlyOpeningBacklogReductionPercent: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/mplp-backlog-reduction-percent",
  title: "More Product Less Process Backlog Reduction Percent Calculator",
  description:
    "Reconcile backlog stock with new accessions, completed processing and separately removed scope, retaining signed net growth; scope removal is not counted as processing.",
  inputs: inputFields,
  outputs: [
    {
      id: "closingBacklogLinearFeet",
      label: "Closing backlog linear feet",
      kind: "number",
    },
    {
      id: "netBacklogReductionPercent",
      label: "Net backlog reduction percent",
      kind: "number",
    },
    {
      id: "processingOnlyOpeningBacklogReductionPercent",
      label: "Processing only opening backlog reduction percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      openingBacklogLinearFeet: value.openingBacklogLinearFeet as number,
      newUnprocessedAccessionsLinearFeet:
        value.newUnprocessedAccessionsLinearFeet as number,
      processedBacklogLinearFeet: value.processedBacklogLinearFeet as number,
      scopeRemovedLinearFeet: value.scopeRemovedLinearFeet as number,
    }),
});
export const run = tool.execute;
export default tool;
