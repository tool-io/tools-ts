import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly actualInstitutionBarcode: string;
  readonly callerVerifiedDataPositionWeights: readonly number[];
  readonly callerVerifiedChecksumModulus: number;
  readonly callerVerifiedChecksumConvention: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInstitutionBarcode",
    label: "Actual institution barcode",
    kind: "string",
  },
  {
    id: "callerVerifiedDataPositionWeights",
    label: "Caller verified data position weights",
    kind: "numberList",
  },
  {
    id: "callerVerifiedChecksumModulus",
    label: "Caller verified checksum modulus",
    kind: "number",
  },
  {
    id: "callerVerifiedChecksumConvention",
    label: "Caller verified checksum convention",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!/^[0-9]{2,128}$/.test(input.actualInstitutionBarcode))
    simpleError(
      "barcode",
      "Restricted2–128ASCIIdecimal digits including final check digit.",
    );
  if (
    input.callerVerifiedDataPositionWeights.length !==
    input.actualInstitutionBarcode.length - 1
  )
    simpleError(
      "weights",
      "Explicit institution scheme weight for every data digit.",
    );
  input.callerVerifiedDataPositionWeights.forEach((v) =>
    bounded(v, "weight", 0, 1000000),
  );
  bounded(input.callerVerifiedChecksumModulus, "modulus", 2, 10);
  if (
    !["complement", "remainder"].includes(
      input.callerVerifiedChecksumConvention,
    )
  )
    simpleError(
      "scheme",
      "Explicit independently verified complement or remainder checksum convention.",
    );
  const total = input.callerVerifiedDataPositionWeights.reduce(
      (a, w, i) => a + BigInt(w) * BigInt(input.actualInstitutionBarcode[i]),
      0n,
    ),
    m = BigInt(input.callerVerifiedChecksumModulus),
    r = total % m,
    e = Number(
      input.callerVerifiedChecksumConvention === "complement" ? (m - r) % m : r,
    ),
    actual = Number(input.actualInstitutionBarcode.at(-1));
  return {
    conditionalExpectedCheckDigit: e,
    actualCheckDigit: actual,
    matchesDeclaredInstitutionScheme: e === actual,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInstitutionBarcode: "12345",
    callerVerifiedDataPositionWeights: [1, 1, 1, 1],
    callerVerifiedChecksumModulus: 10,
    callerVerifiedChecksumConvention: "complement",
  },
  output: {
    result: {
      conditionalExpectedCheckDigit: 0,
      actualCheckDigit: 5,
      matchesDeclaredInstitutionScheme: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/item-barcode-checkdigit-validator",
  title: "Item Level Barcode Check Digit Validator",
  description:
    "Audit actual item-level archive barcode under independently verified institution position-weight/modulus/convention. Not silently assume ISBN/EAN scheme, authenticate object IDsor certify issuer; no duplicate generic barcode algorithm.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
