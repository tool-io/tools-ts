import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  count,
  sum,
  bounded,
  signature,
} from "../shared.js";
export type Input = Readonly<{
  readonly signatureNumerator: number;
  readonly signatureDenominator: number;
  readonly declaredPulseGroups: readonly number[];
}>;
export type Output = Readonly<{
  readonly pulseGroupingClass: string;
  readonly pulseCount: number;
  readonly additiveUnequalPulseGroups: boolean;
}>;
const inputFields = [
  { id: "signatureNumerator", label: "Signature numerator", kind: "number" },
  {
    id: "signatureDenominator",
    label: "Signature denominator",
    kind: "number",
  },
  {
    id: "declaredPulseGroups",
    label: "Declared pulse groups",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  signature(input.signatureNumerator, input.signatureDenominator);
  if (
    !input.declaredPulseGroups.length ||
    input.declaredPulseGroups.length > 32 ||
    sum(input.declaredPulseGroups) !== input.signatureNumerator
  )
    simpleError(
      "groups",
      "Declared pulses must partition signature numerator.",
    );
  input.declaredPulseGroups.forEach((v) => bounded(v, "pulseGroup", 1, 16));
  const n = input.declaredPulseGroups.length;
  return {
    pulseGroupingClass:
      n === 2
        ? "duple"
        : n === 3
          ? "triple"
          : n === 4
            ? "quadruple"
            : n === 1
              ? "single"
              : "higher-count",
    pulseCount: n,
    additiveUnequalPulseGroups: input.declaredPulseGroups.some(
      (v) => v !== input.declaredPulseGroups[0],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signatureNumerator: 12,
  signatureDenominator: 8,
  declaredPulseGroups: [3, 3, 3, 3],
} satisfies Input;
export const exampleOutput = {
  pulseGroupingClass: "quadruple",
  pulseCount: 4,
  additiveUnequalPulseGroups: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/meter-pulse-grouping-classifier",
  title: "Duple/Triple/Quadruple Meter Classifier",
  description:
    "Classify duple/triple/quadruple actual pulse grouping separately from beat subdivision, retaining unequal/additive groups; numerator alone does not identify perceived pulse.",
  inputs: inputFields,
  outputs: [
    { id: "pulseGroupingClass", label: "Pulse grouping class", kind: "string" },
    { id: "pulseCount", label: "Pulse count", kind: "number" },
    {
      id: "additiveUnequalPulseGroups",
      label: "Additive unequal pulse groups",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      signatureNumerator: value.signatureNumerator as number,
      signatureDenominator: value.signatureDenominator as number,
      declaredPulseGroups: value.declaredPulseGroups as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
