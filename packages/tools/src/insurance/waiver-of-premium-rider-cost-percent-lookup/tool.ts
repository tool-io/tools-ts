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
  readonly callerWaiverRiderClassIds: readonly string[];
  readonly callerVerifiedRiderCostBasisPoints: readonly number[];
  readonly queryWaiverRiderClassId: string;
  readonly callerAnnualBaseLifePremiumMinor: number;
  readonly observedQuotedWaiverRiderMinor: number;
}>;
export type Output = Readonly<{
  readonly callerRoundedAnnualWaiverRiderMinor: number;
  readonly signedQuotedWaiverRiderCostDifferenceMinor: number;
}>;
const inputFields = [
  {
    id: "callerWaiverRiderClassIds",
    label: "Caller waiver rider class ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRiderCostBasisPoints",
    label: "Caller verified rider cost basis points",
    kind: "numberList",
  },
  {
    id: "queryWaiverRiderClassId",
    label: "Query waiver rider class id",
    kind: "string",
  },
  {
    id: "callerAnnualBaseLifePremiumMinor",
    label: "Caller annual base life premium minor",
    kind: "number",
  },
  {
    id: "observedQuotedWaiverRiderMinor",
    label: "Observed quoted waiver rider minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedRiderCostBasisPoints.forEach((v) =>
    bounded(v, "bps", 0, 10000),
  );
  money(input.callerAnnualBaseLifePremiumMinor);
  money(input.observedQuotedWaiverRiderMinor);
  const cost = share(
    input.callerAnnualBaseLifePremiumMinor,
    catalog(
      input.callerWaiverRiderClassIds,
      input.callerVerifiedRiderCostBasisPoints,
      input.queryWaiverRiderClassId,
    ),
  );
  return {
    callerRoundedAnnualWaiverRiderMinor: cost,
    signedQuotedWaiverRiderCostDifferenceMinor:
      input.observedQuotedWaiverRiderMinor - cost,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWaiverRiderClassIds: ["a", "b"],
  callerVerifiedRiderCostBasisPoints: [500, 1000],
  queryWaiverRiderClassId: "a",
  callerAnnualBaseLifePremiumMinor: 10000,
  observedQuotedWaiverRiderMinor: 600,
} satisfies Input;
export const exampleOutput = {
  callerRoundedAnnualWaiverRiderMinor: 500,
  signedQuotedWaiverRiderCostDifferenceMinor: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/waiver-of-premium-rider-cost-percent-lookup",
  title: "Waiver Of Premium Rider Cost Percent Lookup",
  description:
    "Audit actual waiver-of-premium rider quote against caller verified product-class cost fraction, not an alarm discount, rider disability definition or benefit entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRoundedAnnualWaiverRiderMinor",
      label: "Caller rounded annual waiver rider minor",
      kind: "number",
    },
    {
      id: "signedQuotedWaiverRiderCostDifferenceMinor",
      label: "Signed quoted waiver rider cost difference minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWaiverRiderClassIds:
        value.callerWaiverRiderClassIds as readonly string[],
      callerVerifiedRiderCostBasisPoints:
        value.callerVerifiedRiderCostBasisPoints as readonly number[],
      queryWaiverRiderClassId: value.queryWaiverRiderClassId as string,
      callerAnnualBaseLifePremiumMinor:
        value.callerAnnualBaseLifePremiumMinor as number,
      observedQuotedWaiverRiderMinor:
        value.observedQuotedWaiverRiderMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
