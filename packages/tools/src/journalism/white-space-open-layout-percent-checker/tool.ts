import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  positive,
  fraction,
  sum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly pageUsableArea: number;
  readonly nonoverlappingOccupiedAreas: readonly number[];
  readonly callerMinimumOpenFraction: number;
}>;
export type Output = Readonly<{
  readonly observedOpenArea: number;
  readonly observedOpenFraction: number;
  readonly meetsCallerOpenLayoutPolicy: boolean;
}>;
const inputFields = [
  { id: "pageUsableArea", label: "Page usable area", kind: "number" },
  {
    id: "nonoverlappingOccupiedAreas",
    label: "Nonoverlapping occupied areas",
    kind: "numberList",
  },
  {
    id: "callerMinimumOpenFraction",
    label: "Caller minimum open fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.pageUsableArea, "pageUsableArea");
  input.nonoverlappingOccupiedAreas.forEach((v) =>
    nonnegative(v, "nonoverlappingOccupiedAreas"),
  );
  fraction(input.callerMinimumOpenFraction, "callerMinimumOpenFraction");
  const occupied = sum(input.nonoverlappingOccupiedAreas);
  if (occupied > input.pageUsableArea)
    simpleError(
      "areas",
      "Caller disjoint occupied areas exceed usable page area.",
    );
  const open = input.pageUsableArea - occupied,
    share = open / input.pageUsableArea;
  return {
    observedOpenArea: open,
    observedOpenFraction: share,
    meetsCallerOpenLayoutPolicy: share >= input.callerMinimumOpenFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pageUsableArea: 100,
  nonoverlappingOccupiedAreas: [30, 20],
  callerMinimumOpenFraction: 0.4,
} satisfies Input;
export const exampleOutput = {
  observedOpenArea: 50,
  observedOpenFraction: 0.5,
  meetsCallerOpenLayoutPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/white-space-open-layout-percent-checker",
  title: "White Space Open Layout Percent Checker",
  description:
    "Audit layout open area from caller already disjoint occupied regions and usable area in consistent square units; does not infer overlap unions, visual balance, universal white-space target or screen-reader accessibility.",
  inputs: inputFields,
  outputs: [
    { id: "observedOpenArea", label: "Observed open area", kind: "number" },
    {
      id: "observedOpenFraction",
      label: "Observed open fraction",
      kind: "number",
    },
    {
      id: "meetsCallerOpenLayoutPolicy",
      label: "Meets caller open layout policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      pageUsableArea: value.pageUsableArea as number,
      nonoverlappingOccupiedAreas:
        value.nonoverlappingOccupiedAreas as readonly number[],
      callerMinimumOpenFraction: value.callerMinimumOpenFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
