import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DelphiAnonymityInput = {
  readonly anonymityThresholdPercent: number;
  readonly identityDataNeeded: ReadonlyArray<string>;
  readonly participantCount: number;
  readonly recruitmentChannels: ReadonlyArray<string>;
};

export type DelphiAnonymityOutput = {
  readonly anonymityDesign: ReadonlyArray<string>;
  readonly protocolReady: boolean;
  readonly recruitmentSteps: ReadonlyArray<string>;
  readonly smallCohortWarning: boolean;
};

export const buildDelphiRecruitmentAnonymityProtocol = (
  input: DelphiAnonymityInput,
): DelphiAnonymityOutput => {
  if (
    !Number.isSafeInteger(input.participantCount) ||
    input.participantCount < 1
  )
    simpleError(
      "participantCount",
      "Participant count must be a positive integer.",
      "invalid_participant_count",
    );
  if (
    !Number.isFinite(input.anonymityThresholdPercent) ||
    input.anonymityThresholdPercent < 1 ||
    input.anonymityThresholdPercent > 100
  )
    simpleError(
      "anonymityThresholdPercent",
      "Anonymity threshold must be a value from 1 through 100.",
      "invalid_anonymity_threshold",
    );
  for (const [field, values] of [
    ["recruitmentChannels", input.recruitmentChannels],
    ["identityDataNeeded", input.identityDataNeeded],
  ] as const) {
    if (!Array.isArray(values) || values.length === 0)
      simpleError(
        field,
        "At least one value is required.",
        "delphi_protocol_list_required",
      );
    for (const [index, value] of values.entries())
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `${field}.${index}`,
          "List values must be nonempty strings.",
          "invalid_delphi_protocol_value",
        );
  }
  const recruitmentChannels = input.recruitmentChannels.map((channel) =>
    channel.trim(),
  );
  const identityDataNeeded = input.identityDataNeeded.map((value) =>
    value.trim(),
  );
  return {
    anonymityDesign: [
      "Collect only identity data required for recruitment or eligibility.",
      "Store recruitment identity separately from panel responses.",
      "Publish group results only when the cohort meets the anonymity threshold.",
      "Remove direct identifiers from exported and shared data.",
    ],
    protocolReady:
      input.participantCount >= 10 &&
      input.participantCount * (input.anonymityThresholdPercent / 100) >= 2,
    recruitmentSteps: [
      `Recruit through ${recruitmentChannels.join(", ")}.`,
      `Document required identity data: ${identityDataNeeded.join(", ")}.`,
      "Use unique panel IDs that cannot be linked to identity in response exports.",
      "Apply the reporting threshold before displaying subgroup or individual results.",
    ],
    smallCohortWarning: input.participantCount < 10,
  };
};

export const delphiAnonymityExample = {
  input: {
    anonymityThresholdPercent: 80,
    identityDataNeeded: ["eligibility", "contact"],
    participantCount: 20,
    recruitmentChannels: ["community list", "partner network"],
  },
  output: {
    anonymityDesign: [
      "Collect only identity data required for recruitment or eligibility.",
      "Store recruitment identity separately from panel responses.",
      "Publish group results only when the cohort meets the anonymity threshold.",
      "Remove direct identifiers from exported and shared data.",
    ],
    protocolReady: true,
    recruitmentSteps: [
      "Recruit through community list, partner network.",
      "Document required identity data: eligibility, contact.",
      "Use unique panel IDs that cannot be linked to identity in response exports.",
      "Apply the reporting threshold before displaying subgroup or individual results.",
    ],
    smallCohortWarning: false,
  },
} satisfies ToolExample<DelphiAnonymityInput, DelphiAnonymityOutput>;

export const delphiAnonymityTool = createSimpleTool({
  calculate: (input) =>
    buildDelphiRecruitmentAnonymityProtocol({
      anonymityThresholdPercent: input.anonymityThresholdPercent as number,
      identityDataNeeded: input.identityDataNeeded as string[],
      participantCount: input.participantCount as number,
      recruitmentChannels: input.recruitmentChannels as string[],
    }),
  description:
    "Build a Delphi recruitment and anonymity protocol with a caller-supplied cohort reporting threshold.",
  id: "futurology/delphi-panel-recruitment-anonymity-protocol-lookup",
  inputs: [
    {
      id: "anonymityThresholdPercent",
      kind: "number",
      label: "Anonymity threshold percent",
      maximum: 100,
      minimum: 1,
      unit: "%",
    },
    {
      id: "identityDataNeeded",
      kind: "stringList",
      label: "Identity data needed",
    },
    {
      id: "participantCount",
      kind: "integer",
      label: "Participant count",
      minimum: 1,
    },
    {
      id: "recruitmentChannels",
      kind: "stringList",
      label: "Recruitment channels",
    },
  ],
  outputs: [
    { id: "anonymityDesign", kind: "stringList", label: "Anonymity design" },
    {
      id: "protocolReady",
      kind: "boolean",
      label: "Protocol threshold supported",
    },
    { id: "recruitmentSteps", kind: "stringList", label: "Recruitment steps" },
    {
      id: "smallCohortWarning",
      kind: "boolean",
      label: "Small cohort warning",
    },
  ],
  title: "Delphi Panel Recruitment Anonymity Protocol Lookup",
});

export const runDelphiAnonymity = delphiAnonymityTool.execute;
export default delphiAnonymityTool;
