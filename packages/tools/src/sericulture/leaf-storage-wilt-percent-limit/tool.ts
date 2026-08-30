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
  readonly initialLeafMassGrams: number;
  readonly storedLeafMassGrams: number;
  readonly initialDryMatterFraction: number;
  readonly storedDryMatterFraction: number;
  readonly callerMaximumWiltFraction: number;
}>;
export type Output = Readonly<{
  readonly totalMassLossFraction: number;
  readonly estimatedWaterLossGrams: number;
  readonly estimatedDryMatterLossGrams: number;
  readonly aboveCallerWiltLimit: boolean;
}>;
const inputFields = [
  {
    id: "initialLeafMassGrams",
    label: "Initial leaf mass grams",
    kind: "number",
  },
  {
    id: "storedLeafMassGrams",
    label: "Stored leaf mass grams",
    kind: "number",
  },
  {
    id: "initialDryMatterFraction",
    label: "Initial dry matter fraction",
    kind: "number",
  },
  {
    id: "storedDryMatterFraction",
    label: "Stored dry matter fraction",
    kind: "number",
  },
  {
    id: "callerMaximumWiltFraction",
    label: "Caller maximum wilt fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialLeafMassGrams, "initialLeafMassGrams");
  nonnegative(input.storedLeafMassGrams, "storedLeafMassGrams");
  fraction(input.initialDryMatterFraction, "initialDryMatterFraction");
  fraction(input.storedDryMatterFraction, "storedDryMatterFraction");
  fraction(input.callerMaximumWiltFraction, "callerMaximumWiltFraction");
  if (input.storedLeafMassGrams > input.initialLeafMassGrams)
    simpleError(
      "storedLeafMassGrams",
      "Matched stored sample cannot exceed initial mass in this loss screen.",
    );
  const totalMassLossFraction =
    1 - input.storedLeafMassGrams / input.initialLeafMassGrams;
  return {
    totalMassLossFraction,
    estimatedWaterLossGrams:
      input.initialLeafMassGrams * (1 - input.initialDryMatterFraction) -
      input.storedLeafMassGrams * (1 - input.storedDryMatterFraction),
    estimatedDryMatterLossGrams:
      input.initialLeafMassGrams * input.initialDryMatterFraction -
      input.storedLeafMassGrams * input.storedDryMatterFraction,
    aboveCallerWiltLimit:
      totalMassLossFraction > input.callerMaximumWiltFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialLeafMassGrams: 100,
  storedLeafMassGrams: 80,
  initialDryMatterFraction: 0.3,
  storedDryMatterFraction: 0.35,
  callerMaximumWiltFraction: 0.15,
} satisfies Input;
export const exampleOutput = {
  totalMassLossFraction: 0.2,
  estimatedWaterLossGrams: 18,
  estimatedDryMatterLossGrams: 2,
  aboveCallerWiltLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/leaf-storage-wilt-percent-limit",
  title: "Leaf Storage Wilt Percent Limit Checker",
  description:
    "Audit matched stored leaf mass loss against a caller wilt criterion and split water/dry change using paired assays; signed component changes are retained and spoilage is not diagnosed.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalMassLossFraction",
      label: "Total mass loss fraction",
      kind: "number",
    },
    {
      id: "estimatedWaterLossGrams",
      label: "Estimated water loss grams",
      kind: "number",
    },
    {
      id: "estimatedDryMatterLossGrams",
      label: "Estimated dry matter loss grams",
      kind: "number",
    },
    {
      id: "aboveCallerWiltLimit",
      label: "Above caller wilt limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      initialLeafMassGrams: value.initialLeafMassGrams as number,
      storedLeafMassGrams: value.storedLeafMassGrams as number,
      initialDryMatterFraction: value.initialDryMatterFraction as number,
      storedDryMatterFraction: value.storedDryMatterFraction as number,
      callerMaximumWiltFraction: value.callerMaximumWiltFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
