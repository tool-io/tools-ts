import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CitizenPanelChecklistInput = {
  readonly accessibilityMeasures: ReadonlyArray<string>;
  readonly minimumRepresentationDimensions: number;
  readonly panelPurpose: string;
  readonly participantCount: number;
  readonly representationCriteria: ReadonlyArray<string>;
};

export type CitizenPanelChecklistOutput = {
  readonly checklist: ReadonlyArray<string>;
  readonly designReady: boolean;
  readonly representationDimensionCount: number;
  readonly totalChecklistItemCount: number;
};

export const designParticipatoryForesightPanel = (
  input: CitizenPanelChecklistInput,
): CitizenPanelChecklistOutput => {
  if (
    typeof input.panelPurpose !== "string" ||
    input.panelPurpose.trim() === ""
  )
    simpleError(
      "panelPurpose",
      "Panel purpose must be a nonempty string.",
      "panel_purpose_required",
    );
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
    !Number.isSafeInteger(input.minimumRepresentationDimensions) ||
    input.minimumRepresentationDimensions < 1
  )
    simpleError(
      "minimumRepresentationDimensions",
      "Minimum representation dimensions must be a positive integer.",
      "invalid_representation_threshold",
    );
  for (const [field, values] of [
    ["representationCriteria", input.representationCriteria],
    ["accessibilityMeasures", input.accessibilityMeasures],
  ] as const) {
    if (!Array.isArray(values) || values.length === 0)
      simpleError(
        field,
        "At least one value is required.",
        "panel_design_list_required",
      );
    for (const [index, value] of values.entries())
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `${field}.${index}`,
          "List values must be nonempty strings.",
          "invalid_panel_design_value",
        );
  }
  const representationCriteria = input.representationCriteria.map((value) =>
    value.trim(),
  );
  const accessibilityMeasures = input.accessibilityMeasures.map((value) =>
    value.trim(),
  );
  const checklist = [
    `Purpose: ${input.panelPurpose.trim()}`,
    `Participants: ${input.participantCount}`,
    ...representationCriteria.map((value) => `Representation: ${value}`),
    ...accessibilityMeasures.map((value) => `Accessibility: ${value}`),
    "Facilitation: Publish questions, evidence, and decision ownership before the panel.",
    "Synthesis: Separate participant claims from analyst interpretation.",
  ];
  return {
    checklist,
    designReady:
      representationCriteria.length >= input.minimumRepresentationDimensions,
    representationDimensionCount: representationCriteria.length,
    totalChecklistItemCount: checklist.length,
  };
};

export const citizenPanelChecklistExample = {
  input: {
    accessibilityMeasures: ["Remote participation", "Captioning"],
    minimumRepresentationDimensions: 3,
    panelPurpose: "Stress-test a regional transition plan",
    participantCount: 24,
    representationCriteria: ["Region", "Age group", "Income band"],
  },
  output: {
    checklist: [
      "Purpose: Stress-test a regional transition plan",
      "Participants: 24",
      "Representation: Region",
      "Representation: Age group",
      "Representation: Income band",
      "Accessibility: Remote participation",
      "Accessibility: Captioning",
      "Facilitation: Publish questions, evidence, and decision ownership before the panel.",
      "Synthesis: Separate participant claims from analyst interpretation.",
    ],
    designReady: true,
    representationDimensionCount: 3,
    totalChecklistItemCount: 9,
  },
} satisfies ToolExample<
  CitizenPanelChecklistInput,
  CitizenPanelChecklistOutput
>;

export const citizenPanelChecklistTool = createSimpleTool({
  calculate: (input) =>
    designParticipatoryForesightPanel({
      accessibilityMeasures: input.accessibilityMeasures as string[],
      minimumRepresentationDimensions:
        input.minimumRepresentationDimensions as number,
      panelPurpose: input.panelPurpose as string,
      participantCount: input.participantCount as number,
      representationCriteria: input.representationCriteria as string[],
    }),
  description:
    "Build a participatory foresight panel design checklist and test representation coverage against a caller-supplied threshold.",
  id: "futurology/participatory-foresight-citizen-panel-design-checklist",
  inputs: [
    {
      id: "accessibilityMeasures",
      kind: "stringList",
      label: "Accessibility measures",
    },
    {
      id: "minimumRepresentationDimensions",
      kind: "integer",
      label: "Minimum representation dimensions",
      minimum: 1,
    },
    { id: "panelPurpose", kind: "string", label: "Panel purpose" },
    {
      id: "participantCount",
      kind: "integer",
      label: "Participant count",
      minimum: 1,
    },
    {
      id: "representationCriteria",
      kind: "stringList",
      label: "Representation criteria",
    },
  ],
  outputs: [
    { id: "checklist", kind: "stringList", label: "Panel design checklist" },
    {
      id: "designReady",
      kind: "boolean",
      label: "Representation threshold met",
    },
    {
      id: "representationDimensionCount",
      kind: "integer",
      label: "Representation dimensions",
      minimum: 1,
    },
    {
      id: "totalChecklistItemCount",
      kind: "integer",
      label: "Checklist items",
      minimum: 1,
    },
  ],
  title: "Participatory Foresight Citizen Panel Design Checklist",
});

export const runCitizenPanelChecklist = citizenPanelChecklistTool.execute;
export default citizenPanelChecklistTool;
