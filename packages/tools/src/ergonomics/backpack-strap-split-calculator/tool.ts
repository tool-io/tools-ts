import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly leftMeasuredVerticalStrapForceN: number;
  readonly rightMeasuredVerticalStrapForceN: number;
  readonly declaredPackWeightForceN: number;
}>;
export type Output = Readonly<{
  readonly leftShareOfMeasuredStrapLoadPercent: number;
  readonly rightShareOfMeasuredStrapLoadPercent: number;
  readonly strapShareOfDeclaredPackWeightPercent: number;
  readonly signedUnaccountedPackWeightForceN: number;
}>;
const inputFields = [
  {
    id: "leftMeasuredVerticalStrapForceN",
    label: "Left measured vertical strap force n",
    kind: "number",
  },
  {
    id: "rightMeasuredVerticalStrapForceN",
    label: "Right measured vertical strap force n",
    kind: "number",
  },
  {
    id: "declaredPackWeightForceN",
    label: "Declared pack weight force n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.declaredPackWeightForceN, "declaredPackWeightForceN");
  nonnegative(
    input.leftMeasuredVerticalStrapForceN,
    "leftMeasuredVerticalStrapForceN",
  );
  nonnegative(
    input.rightMeasuredVerticalStrapForceN,
    "rightMeasuredVerticalStrapForceN",
  );
  const sum = positive(
    input.leftMeasuredVerticalStrapForceN +
      input.rightMeasuredVerticalStrapForceN,
    "strapLoad",
  );
  return {
    leftShareOfMeasuredStrapLoadPercent:
      (100 * input.leftMeasuredVerticalStrapForceN) / sum,
    rightShareOfMeasuredStrapLoadPercent:
      (100 * input.rightMeasuredVerticalStrapForceN) / sum,
    strapShareOfDeclaredPackWeightPercent:
      (100 * sum) / input.declaredPackWeightForceN,
    signedUnaccountedPackWeightForceN: input.declaredPackWeightForceN - sum,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftMeasuredVerticalStrapForceN: 30,
  rightMeasuredVerticalStrapForceN: 50,
  declaredPackWeightForceN: 100,
} satisfies Input;
export const exampleOutput = {
  leftShareOfMeasuredStrapLoadPercent: 37.5,
  rightShareOfMeasuredStrapLoadPercent: 62.5,
  strapShareOfDeclaredPackWeightPercent: 80,
  signedUnaccountedPackWeightForceN: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/backpack-strap-split-calculator",
  title: "Backpack Strap Load Distribution Percentage Split Calculator",
  description:
    "Separate left/right measured vertical-strap balance from share of declared pack weight and unresolved force balance; no assumed full strap support, belt transfer or safe schoolbag/load recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "leftShareOfMeasuredStrapLoadPercent",
      label: "Left share of measured strap load percent",
      kind: "number",
    },
    {
      id: "rightShareOfMeasuredStrapLoadPercent",
      label: "Right share of measured strap load percent",
      kind: "number",
    },
    {
      id: "strapShareOfDeclaredPackWeightPercent",
      label: "Strap share of declared pack weight percent",
      kind: "number",
    },
    {
      id: "signedUnaccountedPackWeightForceN",
      label: "Signed unaccounted pack weight force n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      leftMeasuredVerticalStrapForceN:
        value.leftMeasuredVerticalStrapForceN as number,
      rightMeasuredVerticalStrapForceN:
        value.rightMeasuredVerticalStrapForceN as number,
      declaredPackWeightForceN: value.declaredPackWeightForceN as number,
    }),
});
export const run = tool.execute;
export default tool;
