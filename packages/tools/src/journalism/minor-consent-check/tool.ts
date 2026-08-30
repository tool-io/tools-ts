import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly subjectAge: number;
  readonly consentAge: number;
  readonly guardianConsentDocumented: boolean;
  readonly identityConcealed: boolean;
}>;
export type Output = Readonly<{
  readonly minor: boolean;
  readonly consentGap: boolean;
  readonly publicationStatus: string;
}>;

export const calculate = (input: Input): Output => {
  const minor = input.subjectAge < input.consentAge;
  const consentGap = minor && !input.guardianConsentDocumented;
  return {
    minor,
    consentGap,
    publicationStatus:
      consentGap && !input.identityConcealed
        ? "hold"
        : minor
          ? "review"
          : "cleared",
  };
};

export const exampleInput = {
  subjectAge: 15,
  consentAge: 18,
  guardianConsentDocumented: false,
  identityConcealed: false,
} satisfies Input;
export const exampleOutput = {
  minor: true,
  consentGap: true,
  publicationStatus: "hold",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      subjectAge: input.subjectAge as number,
      consentAge: input.consentAge as number,
      guardianConsentDocumented: input.guardianConsentDocumented as boolean,
      identityConcealed: input.identityConcealed as boolean,
    }),
  description: "Screen minor-subject consent and identity-protection facts.",
  id: "journalism/minor-consent-check",
  inputs: [
    { id: "subjectAge", label: "Subject age", kind: "integer", minimum: 0 },
    { id: "consentAge", label: "Consent age", kind: "integer", minimum: 0 },
    {
      id: "guardianConsentDocumented",
      label: "Guardian consent documented",
      kind: "boolean",
    },
    { id: "identityConcealed", label: "Identity concealed", kind: "boolean" },
  ],
  outputs: [
    { id: "minor", label: "Subject is a minor", kind: "boolean" },
    { id: "consentGap", label: "Required consent missing", kind: "boolean" },
    {
      id: "publicationStatus",
      label: "Publication status",
      kind: "string",
      enum: ["cleared", "hold", "review"],
    },
  ],
  title: "Minor Consent Check",
});

export const run = tool.execute;
export default tool;
