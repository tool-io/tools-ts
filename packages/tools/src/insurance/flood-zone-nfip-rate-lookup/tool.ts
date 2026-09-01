import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, catalog, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerFloodRatingKeyIds: readonly string[];
  readonly callerVerifiedAnnualFloodPremiumMinor: readonly number[];
  readonly queryVerifiedFloodRatingKeyId: string;
  readonly observedFloodQuoteMinor: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedFloodPremiumMinor: number;
  readonly signedObservedFloodQuoteDifferenceMinor: number;
}>;
const inputFields = [
  {
    id: "callerFloodRatingKeyIds",
    label: "Caller flood rating key ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAnnualFloodPremiumMinor",
    label: "Caller verified annual flood premium minor",
    kind: "numberList",
  },
  {
    id: "queryVerifiedFloodRatingKeyId",
    label: "Query verified flood rating key id",
    kind: "string",
  },
  {
    id: "observedFloodQuoteMinor",
    label: "Observed flood quote minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedAnnualFloodPremiumMinor.forEach((v) => money(v));
  money(input.observedFloodQuoteMinor);
  const value = catalog(
    input.callerFloodRatingKeyIds,
    input.callerVerifiedAnnualFloodPremiumMinor,
    input.queryVerifiedFloodRatingKeyId,
  );
  return {
    callerMatchedFloodPremiumMinor: value,
    signedObservedFloodQuoteDifferenceMinor:
      input.observedFloodQuoteMinor - value,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFloodRatingKeyIds: ["zone-a:edition", "zone-b:edition"],
  callerVerifiedAnnualFloodPremiumMinor: [10000, 15000],
  queryVerifiedFloodRatingKeyId: "zone-a:edition",
  observedFloodQuoteMinor: 12000,
} satisfies Input;
export const exampleOutput = {
  callerMatchedFloodPremiumMinor: 10000,
  signedObservedFloodQuoteDifferenceMinor: 2000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/flood-zone-nfip-rate-lookup",
  title: "Flood Zone NFIP Rate Lookup",
  description:
    "Audit actual flood quote against caller fully matched verified rating key (all property/rating-edition factors external); zone alone not an NFIP rate, no published regulatory rate or insurance quote invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedFloodPremiumMinor",
      label: "Caller matched flood premium minor",
      kind: "number",
    },
    {
      id: "signedObservedFloodQuoteDifferenceMinor",
      label: "Signed observed flood quote difference minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFloodRatingKeyIds:
        value.callerFloodRatingKeyIds as readonly string[],
      callerVerifiedAnnualFloodPremiumMinor:
        value.callerVerifiedAnnualFloodPremiumMinor as readonly number[],
      queryVerifiedFloodRatingKeyId:
        value.queryVerifiedFloodRatingKeyId as string,
      observedFloodQuoteMinor: value.observedFloodQuoteMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
