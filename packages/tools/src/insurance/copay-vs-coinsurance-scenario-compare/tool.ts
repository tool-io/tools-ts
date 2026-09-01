import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerAllowedScenarioCostsMinor: readonly number[];
  readonly callerFixedCopayMinor: number;
  readonly callerCoinsuranceBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly callerCopayPatientCostsMinor: readonly number[];
  readonly callerCoinsurancePatientCostsMinor: readonly number[];
  readonly signedCopayMinusCoinsuranceMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "callerAllowedScenarioCostsMinor",
    label: "Caller allowed scenario costs minor",
    kind: "numberList",
  },
  {
    id: "callerFixedCopayMinor",
    label: "Caller fixed copay minor",
    kind: "number",
  },
  {
    id: "callerCoinsuranceBasisPoints",
    label: "Caller coinsurance basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerAllowedScenarioCostsMinor.forEach((v) => money(v));
  money(input.callerFixedCopayMinor);
  bounded(input.callerCoinsuranceBasisPoints, "coinsurance", 0, 10000);
  const copay = input.callerAllowedScenarioCostsMinor.map((v) =>
      Math.min(v, input.callerFixedCopayMinor),
    ),
    coin = input.callerAllowedScenarioCostsMinor.map((v) =>
      share(v, input.callerCoinsuranceBasisPoints),
    );
  return {
    callerCopayPatientCostsMinor: copay,
    callerCoinsurancePatientCostsMinor: coin,
    signedCopayMinusCoinsuranceMinor: copay.map((v, i) => v - coin[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAllowedScenarioCostsMinor: [1000, 10000],
  callerFixedCopayMinor: 2000,
  callerCoinsuranceBasisPoints: 2000,
} satisfies Input;
export const exampleOutput = {
  callerCopayPatientCostsMinor: [1000, 2000],
  callerCoinsurancePatientCostsMinor: [200, 2000],
  signedCopayMinusCoinsuranceMinor: [800, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/copay-vs-coinsurance-scenario-compare",
  title: "Copay vs Coinsurance Scenario Compare Tool",
  description:
    "Compare caller explicitly post-deductible copay versus coinsurance allowed-cost scenarios, cap copay by allowed cost; not total annual plan choice, premiums or exact claim adjudication.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCopayPatientCostsMinor",
      label: "Caller copay patient costs minor",
      kind: "numberList",
    },
    {
      id: "callerCoinsurancePatientCostsMinor",
      label: "Caller coinsurance patient costs minor",
      kind: "numberList",
    },
    {
      id: "signedCopayMinusCoinsuranceMinor",
      label: "Signed copay minus coinsurance minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAllowedScenarioCostsMinor:
        value.callerAllowedScenarioCostsMinor as readonly number[],
      callerFixedCopayMinor: value.callerFixedCopayMinor as number,
      callerCoinsuranceBasisPoints:
        value.callerCoinsuranceBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
