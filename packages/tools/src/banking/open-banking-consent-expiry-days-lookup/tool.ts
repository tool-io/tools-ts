import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  addDays,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly consentGrantedDate: string;
  readonly callerConsentValidDays: number;
  readonly asOfDate: string;
  readonly revokedEvidencePresent: boolean;
}>;
export type Output = Readonly<{
  readonly exclusiveConsentExpiryDate: string;
  readonly signedDaysUntilConsentExpiry: number;
  readonly activeUnderDeclaredConsentWindow: boolean;
}>;
const inputFields = [
  { id: "consentGrantedDate", label: "Consent granted date", kind: "string" },
  {
    id: "callerConsentValidDays",
    label: "Caller consent valid days",
    kind: "number",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
  {
    id: "revokedEvidencePresent",
    label: "Revoked evidence present",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerConsentValidDays, "days", 1, 3660);
  const start = dateDay(input.consentGrantedDate),
    end = addDays(input.consentGrantedDate, input.callerConsentValidDays),
    today = dateDay(input.asOfDate);
  return {
    exclusiveConsentExpiryDate: end,
    signedDaysUntilConsentExpiry: dateDay(end) - today,
    activeUnderDeclaredConsentWindow:
      today >= start && today < dateDay(end) && !input.revokedEvidencePresent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  consentGrantedDate: "2025-01-01",
  callerConsentValidDays: 90,
  asOfDate: "2025-04-01",
  revokedEvidencePresent: false,
} satisfies Input;
export const exampleOutput = {
  exclusiveConsentExpiryDate: "2025-04-01",
  signedDaysUntilConsentExpiry: 0,
  activeUnderDeclaredConsentWindow: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/open-banking-consent-expiry-days-lookup",
  title: "Open Banking Consent Expiry Days Lookup",
  description:
    "Screen explicit open-banking consent window and revocation evidence; no hardcoded regulatory reauthentication duration, scope sufficiency or guarantee that access is authorized.",
  inputs: inputFields,
  outputs: [
    {
      id: "exclusiveConsentExpiryDate",
      label: "Exclusive consent expiry date",
      kind: "string",
    },
    {
      id: "signedDaysUntilConsentExpiry",
      label: "Signed days until consent expiry",
      kind: "number",
    },
    {
      id: "activeUnderDeclaredConsentWindow",
      label: "Active under declared consent window",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      consentGrantedDate: value.consentGrantedDate as string,
      callerConsentValidDays: value.callerConsentValidDays as number,
      asOfDate: value.asOfDate as string,
      revokedEvidencePresent: value.revokedEvidencePresent as boolean,
    }),
});
export const run = tool.execute;
export default tool;
