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
  readonly callerAlarmCertificationIds: readonly string[];
  readonly callerVerifiedAlarmCreditsBasisPoints: readonly number[];
  readonly queryAlarmCertificationId: string;
  readonly callerPreAlarmAnnualPremiumMinor: number;
  readonly callerMatchedAlarmCertificationVerified: boolean;
}>;
export type Output = Readonly<{
  readonly callerRoundedAlarmCreditMinor: number;
  readonly callerNetAnnualPremiumMinor: number;
}>;
const inputFields = [
  {
    id: "callerAlarmCertificationIds",
    label: "Caller alarm certification ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAlarmCreditsBasisPoints",
    label: "Caller verified alarm credits basis points",
    kind: "numberList",
  },
  {
    id: "queryAlarmCertificationId",
    label: "Query alarm certification id",
    kind: "string",
  },
  {
    id: "callerPreAlarmAnnualPremiumMinor",
    label: "Caller pre alarm annual premium minor",
    kind: "number",
  },
  {
    id: "callerMatchedAlarmCertificationVerified",
    label: "Caller matched alarm certification verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedAlarmCreditsBasisPoints.forEach((v) =>
    bounded(v, "bps", 0, 10000),
  );
  money(input.callerPreAlarmAnnualPremiumMinor);
  const rate = catalog(
      input.callerAlarmCertificationIds,
      input.callerVerifiedAlarmCreditsBasisPoints,
      input.queryAlarmCertificationId,
    ),
    credit = input.callerMatchedAlarmCertificationVerified
      ? share(input.callerPreAlarmAnnualPremiumMinor, rate)
      : 0;
  return {
    callerRoundedAlarmCreditMinor: credit,
    callerNetAnnualPremiumMinor:
      input.callerPreAlarmAnnualPremiumMinor - credit,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAlarmCertificationIds: ["a", "b"],
  callerVerifiedAlarmCreditsBasisPoints: [1000, 2000],
  queryAlarmCertificationId: "a",
  callerPreAlarmAnnualPremiumMinor: 10000,
  callerMatchedAlarmCertificationVerified: true,
} satisfies Input;
export const exampleOutput = {
  callerRoundedAlarmCreditMinor: 1000,
  callerNetAnnualPremiumMinor: 9000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/security-alarm-discount-percent-lookup",
  title: "Security Alarm Discount Percent Lookup",
  description:
    "Audit actual verified alarm certification versus caller independently verified premium credit catalog; no security efficacy, universal insurer discount or claim coverage inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRoundedAlarmCreditMinor",
      label: "Caller rounded alarm credit minor",
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
      callerAlarmCertificationIds:
        value.callerAlarmCertificationIds as readonly string[],
      callerVerifiedAlarmCreditsBasisPoints:
        value.callerVerifiedAlarmCreditsBasisPoints as readonly number[],
      queryAlarmCertificationId: value.queryAlarmCertificationId as string,
      callerPreAlarmAnnualPremiumMinor:
        value.callerPreAlarmAnnualPremiumMinor as number,
      callerMatchedAlarmCertificationVerified:
        value.callerMatchedAlarmCertificationVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
