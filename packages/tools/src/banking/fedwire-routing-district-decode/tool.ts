import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aba } from "../batch-shared.js";
export type Input = Readonly<{ readonly routingNumberText: string }>;
export type Output = Readonly<{
  readonly observedRoutingPrefix: string;
  readonly decodedReserveDistrict: number;
  readonly supportedDistrictPrefixFamily: string;
  readonly routingChecksumMatches: boolean;
  readonly districtDecodeAvailable: boolean;
}>;
const inputFields = [
  { id: "routingNumberText", label: "Routing number text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const valid = aba(input.routingNumberText),
    prefix = Number(input.routingNumberText.slice(0, 2));
  let district = -1,
    family = "unclassified";
  if (prefix >= 1 && prefix <= 12) {
    district = prefix;
    family = "ordinary";
  } else if (prefix >= 21 && prefix <= 32) {
    district = prefix - 20;
    family = "thrift-offset";
  } else if (prefix >= 61 && prefix <= 72) {
    district = prefix - 60;
    family = "electronic-offset";
  }
  return {
    observedRoutingPrefix: input.routingNumberText.slice(0, 2),
    decodedReserveDistrict: district,
    supportedDistrictPrefixFamily: family,
    routingChecksumMatches: valid,
    districtDecodeAvailable: district !== -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { routingNumberText: "021000021" } satisfies Input;
export const exampleOutput = {
  observedRoutingPrefix: "02",
  decodedReserveDistrict: 2,
  supportedDistrictPrefixFamily: "ordinary",
  routingChecksumMatches: true,
  districtDecodeAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/fedwire-routing-district-decode",
  title: "Fedwire Routing District Decoder",
  description:
    "Decode supported ABA routing district-prefix families 01–12, 21–32 and 61–72 separately from checksum; other prefixes stay unclassified and no Fedwire participation or institution assignment is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRoutingPrefix",
      label: "Observed routing prefix",
      kind: "string",
    },
    {
      id: "decodedReserveDistrict",
      label: "Decoded reserve district",
      kind: "number",
    },
    {
      id: "supportedDistrictPrefixFamily",
      label: "Supported district prefix family",
      kind: "string",
    },
    {
      id: "routingChecksumMatches",
      label: "Routing checksum matches",
      kind: "boolean",
    },
    {
      id: "districtDecodeAvailable",
      label: "District decode available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ routingNumberText: value.routingNumberText as string }),
});
export const run = tool.execute;
export default tool;
