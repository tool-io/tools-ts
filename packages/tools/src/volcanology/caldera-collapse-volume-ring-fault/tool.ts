import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly outerCollapseRadiusM: number;
  readonly innerUncollapsedRadiusM: number;
  readonly meanSubsidenceM: number;
  readonly subsidedFillFraction: number;
}>;
export type Output = Readonly<{
  readonly annularCollapseVolumeM3: number;
  readonly unfilledCollapseVolumeM3: number;
}>;
const inputFields = [
  {
    id: "outerCollapseRadiusM",
    label: "Outer collapse radius m",
    kind: "number",
  },
  {
    id: "innerUncollapsedRadiusM",
    label: "Inner uncollapsed radius m",
    kind: "number",
  },
  { id: "meanSubsidenceM", label: "Mean subsidence m", kind: "number" },
  {
    id: "subsidedFillFraction",
    label: "Subsided fill fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.outerCollapseRadiusM, "outerCollapseRadiusM");
  nonnegative(input.innerUncollapsedRadiusM, "innerUncollapsedRadiusM");
  nonnegative(input.meanSubsidenceM, "meanSubsidenceM");
  fraction(input.subsidedFillFraction, "subsidedFillFraction");
  if (input.innerUncollapsedRadiusM >= input.outerCollapseRadiusM)
    simpleError(
      "innerUncollapsedRadiusM",
      "Inner core radius must be smaller than outer ring radius.",
    );
  const annularCollapseVolumeM3 =
    Math.PI *
    (input.outerCollapseRadiusM - input.innerUncollapsedRadiusM) *
    (input.outerCollapseRadiusM + input.innerUncollapsedRadiusM) *
    input.meanSubsidenceM;
  return {
    annularCollapseVolumeM3,
    unfilledCollapseVolumeM3:
      annularCollapseVolumeM3 * (1 - input.subsidedFillFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  outerCollapseRadiusM: 10,
  innerUncollapsedRadiusM: 5,
  meanSubsidenceM: 2,
  subsidedFillFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  annularCollapseVolumeM3: 471.23889803846896,
  unfilledCollapseVolumeM3: 376.99111843077515,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/caldera-collapse-volume-ring-fault",
  title: "Caldera Collapse Volume Ring Fault",
  description:
    "Calculate annular caldera subsidence geometry and independently supplied fill reduction; collapse void is not automatically erupted magma withdrawal and no ring-fault displacement model or mapping.",
  inputs: inputFields,
  outputs: [
    {
      id: "annularCollapseVolumeM3",
      label: "Annular collapse volume m3",
      kind: "number",
    },
    {
      id: "unfilledCollapseVolumeM3",
      label: "Unfilled collapse volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      outerCollapseRadiusM: value.outerCollapseRadiusM as number,
      innerUncollapsedRadiusM: value.innerUncollapsedRadiusM as number,
      meanSubsidenceM: value.meanSubsidenceM as number,
      subsidedFillFraction: value.subsidedFillFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
