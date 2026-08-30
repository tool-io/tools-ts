import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly corticalUptake: number;
  readonly referenceUptake: number;
  readonly zeroAnchorSuvr: number;
  readonly hundredAnchorSuvr: number;
}>;
export type Output = Readonly<{
  readonly suvr: number;
  readonly centiloidValue: number;
}>;
const inputFields = [
  { id: "corticalUptake", label: "Cortical uptake", kind: "number" },
  { id: "referenceUptake", label: "Reference uptake", kind: "number" },
  { id: "zeroAnchorSuvr", label: "Zero anchor suvr", kind: "number" },
  { id: "hundredAnchorSuvr", label: "Hundred anchor suvr", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.corticalUptake, "corticalUptake");
  positive(input.referenceUptake, "referenceUptake");
  positive(input.zeroAnchorSuvr, "zeroAnchorSuvr");
  const span = positive(
      input.hundredAnchorSuvr - input.zeroAnchorSuvr,
      "hundredAnchorSuvr",
    ),
    suvr = input.corticalUptake / input.referenceUptake;
  return { suvr, centiloidValue: (100 * (suvr - input.zeroAnchorSuvr)) / span };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  corticalUptake: 15,
  referenceUptake: 10,
  zeroAnchorSuvr: 1,
  hundredAnchorSuvr: 2,
} satisfies Input;
export const exampleOutput = { suvr: 1.5, centiloidValue: 50 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/anchor-calibrated-centiloid",
  title: "Centiloid Scale",
  description:
    "Convert cortex/reference uptake to a Centiloid scale using externally validated pipeline-specific 0/100 SUVR anchors; negative and above-100 results are not clipped.",
  inputs: inputFields,
  outputs: [
    { id: "suvr", label: "Suvr", kind: "number" },
    { id: "centiloidValue", label: "Centiloid value", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      corticalUptake: value.corticalUptake as number,
      referenceUptake: value.referenceUptake as number,
      zeroAnchorSuvr: value.zeroAnchorSuvr as number,
      hundredAnchorSuvr: value.hundredAnchorSuvr as number,
    }),
});
export const run = tool.execute;
export default tool;
