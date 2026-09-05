import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  strictlyIncreasing,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly sampleDepthsM: readonly number[];
  readonly taxonPresenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly firstObservedDepthM: number;
  readonly previousAbsentDepthM: number;
  readonly lowerCoverageCensored: boolean;
}>;
const inputFields = [
  { id: "sampleDepthsM", label: "Sample depths m", kind: "numberList" },
  {
    id: "taxonPresenceFlags",
    label: "Taxon presence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.sampleDepthsM, input.taxonPresenceFlags, "samples");
  strictlyIncreasing(input.sampleDepthsM, "ordered depositional coordinate");
  binary(input.taxonPresenceFlags, "presence");
  const i = input.taxonPresenceFlags.indexOf(1);
  if (i < 0)
    simpleError("evidence", "No observed first occurrence; no invented datum.");
  return {
    firstObservedDepthM: input.sampleDepthsM[i],
    previousAbsentDepthM: input.sampleDepthsM[Math.max(0, i - 1)],
    lowerCoverageCensored: i === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleDepthsM: [0, 1, 2, 3],
  taxonPresenceFlags: [0, 0, 1, 1],
} satisfies Input;
export const exampleOutput = {
  firstObservedDepthM: 2,
  previousAbsentDepthM: 1,
  lowerCoverageCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/biostratigraphy-first-appearance-datum",
  title: "Geology Biostratigraphy First Appearance Datum Calculator",
  description:
    "Observed first taxon occurrence bracket on caller increasing depositional coordinate; lower-coverage censoring explicit, not global evolutionary FAD. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstObservedDepthM",
      label: "First observed depth m",
      kind: "number",
    },
    {
      id: "previousAbsentDepthM",
      label: "Previous absent depth m",
      kind: "number",
    },
    {
      id: "lowerCoverageCensored",
      label: "Lower coverage censored",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleDepthsM: value.sampleDepthsM as readonly number[],
      taxonPresenceFlags: value.taxonPresenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
