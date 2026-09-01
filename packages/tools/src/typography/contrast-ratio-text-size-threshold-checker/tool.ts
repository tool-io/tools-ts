import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredContrastRatio: number;
  readonly fontSizeCssPx: number;
  readonly fontWeight: number;
  readonly callerLargeTextMinimumPx: number;
  readonly callerLargeBoldMinimumPx: number;
  readonly callerBoldMinimumWeight: number;
  readonly callerNormalContrastMinimum: number;
  readonly callerLargeContrastMinimum: number;
}>;
export type Output = Readonly<{
  readonly classifiedAsCallerLargeText: boolean;
  readonly requiredCallerContrastRatio: number;
  readonly signedContrastMargin: number;
  readonly meetsCallerContrastPolicy: boolean;
}>;
const inputFields = [
  {
    id: "measuredContrastRatio",
    label: "Measured contrast ratio",
    kind: "number",
  },
  { id: "fontSizeCssPx", label: "Font size css px", kind: "number" },
  { id: "fontWeight", label: "Font weight", kind: "number" },
  {
    id: "callerLargeTextMinimumPx",
    label: "Caller large text minimum px",
    kind: "number",
  },
  {
    id: "callerLargeBoldMinimumPx",
    label: "Caller large bold minimum px",
    kind: "number",
  },
  {
    id: "callerBoldMinimumWeight",
    label: "Caller bold minimum weight",
    kind: "number",
  },
  {
    id: "callerNormalContrastMinimum",
    label: "Caller normal contrast minimum",
    kind: "number",
  },
  {
    id: "callerLargeContrastMinimum",
    label: "Caller large contrast minimum",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fontSizeCssPx, "fontSizeCssPx");
  positive(input.callerLargeTextMinimumPx, "callerLargeTextMinimumPx");
  positive(input.callerLargeBoldMinimumPx, "callerLargeBoldMinimumPx");
  positive(input.callerNormalContrastMinimum, "callerNormalContrastMinimum");
  positive(input.callerLargeContrastMinimum, "callerLargeContrastMinimum");
  nonnegative(input.fontWeight, "fontWeight");
  nonnegative(input.callerBoldMinimumWeight, "callerBoldMinimumWeight");
  if (input.measuredContrastRatio < 1 || input.measuredContrastRatio > 21)
    simpleError("ratio", "Contrast ratio in [1,21] required.");
  const large =
      input.fontSizeCssPx >= input.callerLargeTextMinimumPx ||
      (input.fontWeight >= input.callerBoldMinimumWeight &&
        input.fontSizeCssPx >= input.callerLargeBoldMinimumPx),
    required = large
      ? input.callerLargeContrastMinimum
      : input.callerNormalContrastMinimum;
  return {
    classifiedAsCallerLargeText: large,
    requiredCallerContrastRatio: required,
    signedContrastMargin: input.measuredContrastRatio - required,
    meetsCallerContrastPolicy: input.measuredContrastRatio >= required,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredContrastRatio: 4,
  fontSizeCssPx: 20,
  fontWeight: 400,
  callerLargeTextMinimumPx: 24,
  callerLargeBoldMinimumPx: 18.6666666667,
  callerBoldMinimumWeight: 700,
  callerNormalContrastMinimum: 4.5,
  callerLargeContrastMinimum: 3,
} satisfies Input;
export const exampleOutput = {
  classifiedAsCallerLargeText: false,
  requiredCallerContrastRatio: 4.5,
  signedContrastMargin: -0.5,
  meetsCallerContrastPolicy: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/contrast-ratio-text-size-threshold-checker",
  title: "Contrast Ratio Text-Size Threshold Check",
  description:
    "Screen independently measured contrast with caller text-size/weight thresholds and normal/large policy; no duplicate hex-color contrast derivation or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "classifiedAsCallerLargeText",
      label: "Classified as caller large text",
      kind: "boolean",
    },
    {
      id: "requiredCallerContrastRatio",
      label: "Required caller contrast ratio",
      kind: "number",
    },
    {
      id: "signedContrastMargin",
      label: "Signed contrast margin",
      kind: "number",
    },
    {
      id: "meetsCallerContrastPolicy",
      label: "Meets caller contrast policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredContrastRatio: value.measuredContrastRatio as number,
      fontSizeCssPx: value.fontSizeCssPx as number,
      fontWeight: value.fontWeight as number,
      callerLargeTextMinimumPx: value.callerLargeTextMinimumPx as number,
      callerLargeBoldMinimumPx: value.callerLargeBoldMinimumPx as number,
      callerBoldMinimumWeight: value.callerBoldMinimumWeight as number,
      callerNormalContrastMinimum: value.callerNormalContrastMinimum as number,
      callerLargeContrastMinimum: value.callerLargeContrastMinimum as number,
    }),
});
export const run = tool.execute;
export default tool;
