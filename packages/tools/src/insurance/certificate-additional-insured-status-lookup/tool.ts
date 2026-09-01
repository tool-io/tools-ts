import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCertificateNamesEntity: boolean;
  readonly observedEndorsementNamesEntity: boolean;
  readonly endorsementTextEvidenceAvailable: boolean;
  readonly callerAdditionalInsuredRequired: boolean;
}>;
export type Output = Readonly<{
  readonly certificateOnlyDoesNotEstablishEndorsement: boolean;
  readonly callerRequiredEndorsementStatus: string;
}>;
const inputFields = [
  {
    id: "observedCertificateNamesEntity",
    label: "Observed certificate names entity",
    kind: "boolean",
  },
  {
    id: "observedEndorsementNamesEntity",
    label: "Observed endorsement names entity",
    kind: "boolean",
  },
  {
    id: "endorsementTextEvidenceAvailable",
    label: "Endorsement text evidence available",
    kind: "boolean",
  },
  {
    id: "callerAdditionalInsuredRequired",
    label: "Caller additional insured required",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    certificateOnlyDoesNotEstablishEndorsement:
      input.observedCertificateNamesEntity &&
      (!input.endorsementTextEvidenceAvailable ||
        !input.observedEndorsementNamesEntity),
    callerRequiredEndorsementStatus: !input.callerAdditionalInsuredRequired
      ? "not-required"
      : !input.endorsementTextEvidenceAvailable
        ? "unknown"
        : input.observedEndorsementNamesEntity
          ? "evidenced"
          : "not-evidenced",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCertificateNamesEntity: true,
  observedEndorsementNamesEntity: false,
  endorsementTextEvidenceAvailable: false,
  callerAdditionalInsuredRequired: true,
} satisfies Input;
export const exampleOutput = {
  certificateOnlyDoesNotEstablishEndorsement: true,
  callerRequiredEndorsementStatus: "unknown",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/certificate-additional-insured-status-lookup",
  title: "Certificate Additional Insured Status Lookup",
  description:
    "Keep actual certificate versus independently available endorsement evidence distinct for caller additional-insured requirement; no certificate grants policy rights or legal coverage conclusion.",
  inputs: inputFields,
  outputs: [
    {
      id: "certificateOnlyDoesNotEstablishEndorsement",
      label: "Certificate only does not establish endorsement",
      kind: "boolean",
    },
    {
      id: "callerRequiredEndorsementStatus",
      label: "Caller required endorsement status",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCertificateNamesEntity:
        value.observedCertificateNamesEntity as boolean,
      observedEndorsementNamesEntity:
        value.observedEndorsementNamesEntity as boolean,
      endorsementTextEvidenceAvailable:
        value.endorsementTextEvidenceAvailable as boolean,
      callerAdditionalInsuredRequired:
        value.callerAdditionalInsuredRequired as boolean,
    }),
});
export const run = tool.execute;
export default tool;
