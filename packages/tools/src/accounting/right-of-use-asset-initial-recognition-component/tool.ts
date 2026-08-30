import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly initialLeaseLiabilityMinor: number;
  readonly precommencementPaymentsMinor: number;
  readonly initialDirectCostsMinor: number;
  readonly incentivesReceivedMinor: number;
}>;
export type Output = Readonly<{
  readonly modeledInitialRouAssetMinor: number;
  readonly rouLessLeaseLiabilityMinor: number;
}>;
const inputFields = [
  {
    id: "initialLeaseLiabilityMinor",
    label: "Initial lease liability minor",
    kind: "number",
  },
  {
    id: "precommencementPaymentsMinor",
    label: "Precommencement payments minor",
    kind: "number",
  },
  {
    id: "initialDirectCostsMinor",
    label: "Initial direct costs minor",
    kind: "number",
  },
  {
    id: "incentivesReceivedMinor",
    label: "Incentives received minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.initialLeaseLiabilityMinor, "initialLeaseLiabilityMinor");
  money(input.precommencementPaymentsMinor, "precommencementPaymentsMinor");
  money(input.initialDirectCostsMinor, "initialDirectCostsMinor");
  money(input.incentivesReceivedMinor, "incentivesReceivedMinor");
  const value = signedSum([
    input.initialLeaseLiabilityMinor,
    input.precommencementPaymentsMinor,
    input.initialDirectCostsMinor,
    -input.incentivesReceivedMinor,
  ]);
  if (value < 0)
    simpleError(
      "rou",
      "Caller initial ROU model cannot produce negative asset; treatment requires separate review.",
    );
  return {
    modeledInitialRouAssetMinor: value,
    rouLessLeaseLiabilityMinor: integer(
      value - input.initialLeaseLiabilityMinor,
      "difference",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialLeaseLiabilityMinor: 1000,
  precommencementPaymentsMinor: 100,
  initialDirectCostsMinor: 50,
  incentivesReceivedMinor: 80,
} satisfies Input;
export const exampleOutput = {
  modeledInitialRouAssetMinor: 1070,
  rouLessLeaseLiabilityMinor: 70,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/right-of-use-asset-initial-recognition-component",
  title: "Right Of Use Asset Initial Recognition Component Tool",
  description:
    "Reconcile initial ROU asset components from separately measured lease liability, prepaid payments, direct costs and received incentives; no duplicate fixed-annuity PV computation or inference about includable costs/framework.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledInitialRouAssetMinor",
      label: "Modeled initial rou asset minor",
      kind: "number",
    },
    {
      id: "rouLessLeaseLiabilityMinor",
      label: "Rou less lease liability minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialLeaseLiabilityMinor: value.initialLeaseLiabilityMinor as number,
      precommencementPaymentsMinor:
        value.precommencementPaymentsMinor as number,
      initialDirectCostsMinor: value.initialDirectCostsMinor as number,
      incentivesReceivedMinor: value.incentivesReceivedMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
