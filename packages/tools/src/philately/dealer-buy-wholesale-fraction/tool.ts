import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  rateMinor,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly catalogueBaseMinor: number;
  readonly wholesaleBasisPoints: number;
}>;
export type Output = Readonly<{ readonly estimatedValueMinor: number }>;
const inputFields = [
  { id: "catalogueBaseMinor", label: "Catalogue base minor", kind: "number" },
  {
    id: "wholesaleBasisPoints",
    label: "Wholesale basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.catalogueBaseMinor, "amount");
  bounded(input.wholesaleBasisPoints, "basis points", 0, 10000);
  return {
    estimatedValueMinor: rateMinor(
      input.catalogueBaseMinor,
      input.wholesaleBasisPoints,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  catalogueBaseMinor: 10001,
  wholesaleBasisPoints: 3000,
} satisfies Input;
export const exampleOutput = { estimatedValueMinor: 3000 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/dealer-buy-wholesale-fraction",
  title: "Dealer Buy Price Wholesale Fraction Calculator",
  description:
    "Apply independently negotiated dealer wholesale fraction. Exact nearest-minor rounding with ties away from zero, one caller currency. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedValueMinor",
      label: "Estimated value minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      catalogueBaseMinor: value.catalogueBaseMinor as number,
      wholesaleBasisPoints: value.wholesaleBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
