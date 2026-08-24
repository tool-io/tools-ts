import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CountryCodeAlpha2ValidatorInput = {
  readonly code: string;
};

export type CountryCodeAlpha2ValidatorOutput = {
  readonly isValid: boolean;
  readonly normalizedCode: string;
};

const ASSIGNED_ALPHA2 =
  "ADAEAFAGAIALAMAOAQARASATAUAWAXAZBABBBDBEBFBGBHBIBJBLBMBNBOBQBRBSBTBVBWBYBZCACCCDCFCGCHCICKCLCMCNCOCRCUCVCWCXCYCZDEDJDKDMDODZECEEEGEHERESETFIFJFKFMFOFRGAGBGDGEGFGGGHGIGLGMGNGPGQGRGSGTGUGWGYHKHMHNHRHTHUIDIEILIMINIOIQIRISITJEJMJOJPKEKGKHKIKMKNKPKRKWKYKZLALBLCLILKLRLSLTLULVLYMAMCMDMEMFMGMHMKMLMMMNMOMPMQMRMSMTMUMVMWMXMYMZNANCNENFNGNINLNONPNRNUNZOMPAPEPFPGPHPKPLPMPNPRPSPTPWPYQARERORSRURWSASBSCSDSESGSHSISJSKSLSMSNSOSRSSSTSVSXSYSZTCTDTFTGTHTJTKTLTMTNTOTRTTTVTWTZUAUGUMUSUYUZVAVCVEVGVIVNVUWFWSYEYTZAZMZW";
const ASSIGNED_ALPHA2_CODES = new Set(
  Array.from({ length: ASSIGNED_ALPHA2.length / 2 }, (_, index) =>
    ASSIGNED_ALPHA2.slice(index * 2, index * 2 + 2),
  ),
);

export const calculateCountryCodeAlpha2Validator = (
  input: CountryCodeAlpha2ValidatorInput,
): CountryCodeAlpha2ValidatorOutput => {
  if (typeof input.code !== "string")
    simpleError("code", "Code must be a string.", "invalid_code");
  if (input.code.trim().length === 0)
    simpleError("code", "Code must not be empty.", "invalid_code");
  const normalizedCode = input.code.trim().toUpperCase();
  return {
    isValid: ASSIGNED_ALPHA2_CODES.has(normalizedCode),
    normalizedCode,
  };
};

export const countryCodeAlpha2ValidatorExample = {
  input: { code: "us" },
  output: { isValid: true, normalizedCode: "US" },
} satisfies ToolExample<
  CountryCodeAlpha2ValidatorInput,
  CountryCodeAlpha2ValidatorOutput
>;

export const countryCodeAlpha2ValidatorTool = createSimpleTool({
  id: "archival-studies/country-code-alpha2-validator",
  title: "Country Code ISO 3166 Alpha-2 Validator",
  description:
    "Validate whether a normalized two-letter value is a currently assigned ISO 3166-1 alpha-2 country code. Reserved and user-assigned letter pairs are not accepted.",
  inputs: [
    {
      description: "Candidate two-letter country code.",
      id: "code",
      kind: "string",
      label: "Code",
    },
  ],
  outputs: [
    {
      description:
        "True when the code is in the assigned ISO 3166-1 alpha-2 set.",
      id: "isValid",
      kind: "boolean",
      label: "Valid",
    },
    {
      description: "Trimmed uppercase form of the code.",
      id: "normalizedCode",
      kind: "string",
      label: "Normalized",
    },
  ],
  calculate: (input) =>
    calculateCountryCodeAlpha2Validator({
      code: input.code as string,
    }),
});

export const runCountryCodeAlpha2Validator =
  countryCodeAlpha2ValidatorTool.execute;
export default countryCodeAlpha2ValidatorTool;
