import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  catalog,
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerEarthquakeRetrofitIds: readonly string[];
  readonly callerVerifiedRetrofitCreditsBasisPoints: readonly number[];
  readonly queryRetrofitId: string;
  readonly callerPreRetrofitAnnualPremiumMinor: number;
  readonly callerBraceBoltEvidenceVerified: boolean;
}>;
export type Output = Readonly<{
  readonly callerRoundedRetrofitCreditMinor: number;
  readonly callerNetAnnualPremiumMinor: number;
}>;
const inputFields = [
  {
    id: "callerEarthquakeRetrofitIds",
    label: "Caller earthquake retrofit ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRetrofitCreditsBasisPoints",
    label: "Caller verified retrofit credits basis points",
    kind: "numberList",
  },
  { id: "queryRetrofitId", label: "Query retrofit id", kind: "string" },
  {
    id: "callerPreRetrofitAnnualPremiumMinor",
    label: "Caller pre retrofit annual premium minor",
    kind: "number",
  },
  {
    id: "callerBraceBoltEvidenceVerified",
    label: "Caller brace bolt evidence verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedRetrofitCreditsBasisPoints.forEach((v) =>
    bounded(v, "bps", 0, 10000),
  );
  money(input.callerPreRetrofitAnnualPremiumMinor);
  const rate = catalog(
      input.callerEarthquakeRetrofitIds,
      input.callerVerifiedRetrofitCreditsBasisPoints,
      input.queryRetrofitId,
    ),
    credit = input.callerBraceBoltEvidenceVerified
      ? share(input.callerPreRetrofitAnnualPremiumMinor, rate)
      : 0;
  return {
    callerRoundedRetrofitCreditMinor: credit,
    callerNetAnnualPremiumMinor:
      input.callerPreRetrofitAnnualPremiumMinor - credit,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEarthquakeRetrofitIds: ["a", "b"],
  callerVerifiedRetrofitCreditsBasisPoints: [1000, 2000],
  queryRetrofitId: "a",
  callerPreRetrofitAnnualPremiumMinor: 10000,
  callerBraceBoltEvidenceVerified: true,
} satisfies Input;
export const exampleOutput = {
  callerRoundedRetrofitCreditMinor: 1000,
  callerNetAnnualPremiumMinor: 9000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/earthquake-retrofit-brace-bolt-discount-lookup",
  title: "Earthquake Retrofit Brace Bolt Discount Lookup",
  description:
    "Audit actual brace/bolt evidence against caller independently verified earthquake retrofit premium credit catalog; not water-leak or wind mitigation credit, structural readiness or policy entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRoundedRetrofitCreditMinor",
      label: "Caller rounded retrofit credit minor",
      kind: "number",
    },
    {
      id: "callerNetAnnualPremiumMinor",
      label: "Caller net annual premium minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEarthquakeRetrofitIds:
        value.callerEarthquakeRetrofitIds as readonly string[],
      callerVerifiedRetrofitCreditsBasisPoints:
        value.callerVerifiedRetrofitCreditsBasisPoints as readonly number[],
      queryRetrofitId: value.queryRetrofitId as string,
      callerPreRetrofitAnnualPremiumMinor:
        value.callerPreRetrofitAnnualPremiumMinor as number,
      callerBraceBoltEvidenceVerified:
        value.callerBraceBoltEvidenceVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
