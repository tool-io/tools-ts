import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
  signedSum,
  exactProduct,
  positiveCounts,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly collectionItems: number;
  readonly slotsPerPage: number;
}>;
export type Output = Readonly<{
  readonly pagesNeeded: number;
  readonly unusedSlots: number;
}>;
const inputFields = [
  { id: "collectionItems", label: "Collection items", kind: "number" },
  { id: "slotsPerPage", label: "Slots per page", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.collectionItems, "collectionItems");
  integer(input.collectionItems, "items");
  positiveCounts([input.slotsPerPage]);
  const pages = integer(
    Math.ceil(input.collectionItems / input.slotsPerPage),
    "pages",
  );
  return {
    pagesNeeded: pages,
    unusedSlots: signedSum([
      exactProduct(pages, input.slotsPerPage),
      -input.collectionItems,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  collectionItems: 33,
  slotsPerPage: 16,
} satisfies Input;
export const exampleOutput = {
  pagesNeeded: 3,
  unusedSlots: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/album-pages-needed-calculator",
  title: "Album Pages Needed for Collection Size Calculator",
  description:
    "Ceiling actual collection slot demand into pages and retain final-page unused capacity. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "pagesNeeded", label: "Pages needed", kind: "number" },
    { id: "unusedSlots", label: "Unused slots", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      collectionItems: value.collectionItems as number,
      slotsPerPage: value.slotsPerPage as number,
    }),
});
export const run = tool.execute;
export default tool;
