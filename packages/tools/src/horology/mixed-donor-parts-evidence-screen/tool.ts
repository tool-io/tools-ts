import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MixedDonorPartsInput = {
  readonly confirmedDonorPartCount: number;
  readonly movementCaseIdentityConfirmed: boolean;
  readonly movementSerialMatchesDocumentation: boolean;
  readonly originalConfigurationFullyDocumented: boolean;
};

export type MixedDonorPartsOutput = {
  readonly classification:
    | "confirmedMixedParts"
    | "inconsistentIdentityEvidence"
    | "supportedOriginalConfiguration";
  readonly configurationCaution: string;
  readonly confirmedDonorPartCount: number;
};

export const screenMixedDonorPartsEvidence = (
  input: MixedDonorPartsInput,
): MixedDonorPartsOutput => {
  if (
    !Number.isSafeInteger(input.confirmedDonorPartCount) ||
    input.confirmedDonorPartCount < 0
  )
    simpleError(
      "confirmedDonorPartCount",
      "Confirmed donor-part count must be a nonnegative safe integer.",
      "donor_part_count_invalid",
    );
  const classification =
    input.confirmedDonorPartCount > 0
      ? "confirmedMixedParts"
      : input.movementCaseIdentityConfirmed &&
          input.movementSerialMatchesDocumentation &&
          input.originalConfigurationFullyDocumented
        ? "supportedOriginalConfiguration"
        : "inconsistentIdentityEvidence";
  return {
    classification,
    configurationCaution:
      "A donor-part count documents a change; it does not by itself prove fraud, assign originality, or determine value. Compare the movement, case, dial, hands, and documented service parts individually.",
    confirmedDonorPartCount: input.confirmedDonorPartCount,
  };
};

export const mixedDonorPartsExample = {
  input: {
    confirmedDonorPartCount: 1,
    movementCaseIdentityConfirmed: false,
    movementSerialMatchesDocumentation: false,
    originalConfigurationFullyDocumented: false,
  },
  output: {
    classification: "confirmedMixedParts",
    configurationCaution:
      "A donor-part count documents a change; it does not by itself prove fraud, assign originality, or determine value. Compare the movement, case, dial, hands, and documented service parts individually.",
    confirmedDonorPartCount: 1,
  },
} satisfies ToolExample<MixedDonorPartsInput, MixedDonorPartsOutput>;

export const mixedDonorPartsTool = createSimpleTool({
  calculate: (input) =>
    screenMixedDonorPartsEvidence({
      confirmedDonorPartCount: input.confirmedDonorPartCount as number,
      movementCaseIdentityConfirmed:
        input.movementCaseIdentityConfirmed as boolean,
      movementSerialMatchesDocumentation:
        input.movementSerialMatchesDocumentation as boolean,
      originalConfigurationFullyDocumented:
        input.originalConfigurationFullyDocumented as boolean,
    }),
  description:
    "Organize explicit movement, case, serial, documentation, and donor-part evidence without converting a confirmed replacement into a fraud verdict.",
  id: "horology/mixed-donor-parts-evidence-screen",
  inputs: [
    {
      id: "confirmedDonorPartCount",
      kind: "integer",
      label: "Confirmed donor-part count",
      minimum: 0,
    },
    {
      id: "movementCaseIdentityConfirmed",
      kind: "boolean",
      label: "Movement and case identity confirmed",
    },
    {
      id: "movementSerialMatchesDocumentation",
      kind: "boolean",
      label: "Movement serial matches documentation",
    },
    {
      id: "originalConfigurationFullyDocumented",
      kind: "boolean",
      label: "Original configuration fully documented",
    },
  ],
  outputs: [
    {
      enum: [
        "confirmedMixedParts",
        "supportedOriginalConfiguration",
        "inconsistentIdentityEvidence",
      ],
      id: "classification",
      kind: "string",
      label: "Configuration evidence classification",
    },
    {
      id: "configurationCaution",
      kind: "string",
      label: "Configuration evidence caution",
    },
    {
      id: "confirmedDonorPartCount",
      kind: "integer",
      label: "Confirmed donor-part count",
      minimum: 0,
    },
  ],
  title: "Mixed Donor Parts Evidence Screen",
});

export const runMixedDonorParts = mixedDonorPartsTool.execute;
export default mixedDonorPartsTool;
