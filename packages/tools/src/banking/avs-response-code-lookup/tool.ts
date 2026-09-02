import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  catalogIndex,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerAvsResponseCodes: readonly string[];
  readonly callerStreetMatchFlags: readonly number[];
  readonly callerPostalMatchFlags: readonly number[];
  readonly callerMatchEvidenceKnownFlags: readonly number[];
  readonly observedAvsCode: string;
  readonly callerRequireBothMatches: boolean;
}>;
export type Output = Readonly<{
  readonly callerMappedStreetMatches: boolean;
  readonly callerMappedPostalMatches: boolean;
  readonly matchEvidenceUnknown: boolean;
  readonly callerAvsReviewRequired: boolean;
}>;
const inputFields = [
  {
    id: "callerAvsResponseCodes",
    label: "Caller avs response codes",
    kind: "stringList",
  },
  {
    id: "callerStreetMatchFlags",
    label: "Caller street match flags",
    kind: "numberList",
  },
  {
    id: "callerPostalMatchFlags",
    label: "Caller postal match flags",
    kind: "numberList",
  },
  {
    id: "callerMatchEvidenceKnownFlags",
    label: "Caller match evidence known flags",
    kind: "numberList",
  },
  { id: "observedAvsCode", label: "Observed avs code", kind: "string" },
  {
    id: "callerRequireBothMatches",
    label: "Caller require both matches",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerAvsResponseCodes, "codes");
  for (const v of [
    input.callerStreetMatchFlags,
    input.callerPostalMatchFlags,
    input.callerMatchEvidenceKnownFlags,
  ]) {
    aligned(input.callerAvsResponseCodes, v, "codes");
    binary(v, "flags");
  }
  const i = catalogIndex(input.callerAvsResponseCodes, input.observedAvsCode),
    known = !!input.callerMatchEvidenceKnownFlags[i],
    street = known && !!input.callerStreetMatchFlags[i],
    postal = known && !!input.callerPostalMatchFlags[i];
  return {
    callerMappedStreetMatches: street,
    callerMappedPostalMatches: postal,
    matchEvidenceUnknown: !known,
    callerAvsReviewRequired:
      !known ||
      (input.callerRequireBothMatches
        ? !street || !postal
        : !street && !postal),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAvsResponseCodes: ["Y", "N", "U"],
  callerStreetMatchFlags: [1, 0, 0],
  callerPostalMatchFlags: [1, 0, 0],
  callerMatchEvidenceKnownFlags: [1, 1, 0],
  observedAvsCode: "U",
  callerRequireBothMatches: true,
} satisfies Input;
export const exampleOutput = {
  callerMappedStreetMatches: false,
  callerMappedPostalMatches: false,
  matchEvidenceUnknown: true,
  callerAvsReviewRequired: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/avs-response-code-lookup",
  title: "AVS Response Code Lookup",
  description:
    "Interpret actual AVS response via caller scheme edition street/postal/known mapping and review policy, unknown not false identity or proof of card fraud. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMappedStreetMatches",
      label: "Caller mapped street matches",
      kind: "boolean",
    },
    {
      id: "callerMappedPostalMatches",
      label: "Caller mapped postal matches",
      kind: "boolean",
    },
    {
      id: "matchEvidenceUnknown",
      label: "Match evidence unknown",
      kind: "boolean",
    },
    {
      id: "callerAvsReviewRequired",
      label: "Caller avs review required",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAvsResponseCodes: value.callerAvsResponseCodes as readonly string[],
      callerStreetMatchFlags: value.callerStreetMatchFlags as readonly number[],
      callerPostalMatchFlags: value.callerPostalMatchFlags as readonly number[],
      callerMatchEvidenceKnownFlags:
        value.callerMatchEvidenceKnownFlags as readonly number[],
      observedAvsCode: value.observedAvsCode as string,
      callerRequireBothMatches: value.callerRequireBothMatches as boolean,
    }),
});
export const run = tool.execute;
export default tool;
