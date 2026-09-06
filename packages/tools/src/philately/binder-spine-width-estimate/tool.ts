import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly pageCount: number;
  readonly loadedPageThicknessMm: number;
  readonly fixedCoverAllowanceMm: number;
}>;
export type Output = Readonly<{ readonly estimatedSpineMm: number }>;
const inputFields = [
  { id: "pageCount", label: "Page count", kind: "number" },
  {
    id: "loadedPageThicknessMm",
    label: "Loaded page thickness mm",
    kind: "number",
  },
  {
    id: "fixedCoverAllowanceMm",
    label: "Fixed cover allowance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.loadedPageThicknessMm, "loadedPageThicknessMm");
  nonnegative(input.pageCount, "pageCount");
  nonnegative(input.fixedCoverAllowanceMm, "fixedCoverAllowanceMm");
  integer(input.pageCount, "pages");
  return {
    estimatedSpineMm:
      input.pageCount * input.loadedPageThicknessMm +
      input.fixedCoverAllowanceMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pageCount: 20,
  loadedPageThicknessMm: 1.5,
  fixedCoverAllowanceMm: 4,
} satisfies Input;
export const exampleOutput = { estimatedSpineMm: 34 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/binder-spine-width-estimate",
  title: "Binder Spine Width Estimate from Page Count Calculator",
  description:
    "Estimate loaded spine using measured representative loaded-page thickness and caller cover allowance, not bare paper thickness. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "estimatedSpineMm", label: "Estimated spine mm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      pageCount: value.pageCount as number,
      loadedPageThicknessMm: value.loadedPageThicknessMm as number,
      fixedCoverAllowanceMm: value.fixedCoverAllowanceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
