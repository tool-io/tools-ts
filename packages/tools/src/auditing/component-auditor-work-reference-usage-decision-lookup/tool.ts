import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ComponentAuditorWorkInput = {
  readonly componentAuditorWorkSufficient: boolean;
  readonly groupAuditorObtainedEvidence: boolean;
  readonly instructionsClear: boolean;
  readonly materialComponent: boolean;
};

export type ComponentAuditorWorkOutput = {
  readonly additionalGroupWorkRequired: boolean;
  readonly decision:
    "additional_group_work" | "use_component_work" | "professional_judgment";
  readonly reasons: ReadonlyArray<string>;
};

export const decideComponentAuditorWorkUsage = (
  input: ComponentAuditorWorkInput,
): ComponentAuditorWorkOutput => {
  for (const field of [
    "componentAuditorWorkSufficient",
    "groupAuditorObtainedEvidence",
    "instructionsClear",
    "materialComponent",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (
    input.componentAuditorWorkSufficient &&
    input.groupAuditorObtainedEvidence
  )
    return {
      additionalGroupWorkRequired: false,
      decision: "use_component_work",
      reasons: input.instructionsClear ? [] : ["instructions_unclear"],
    };
  if (
    !input.componentAuditorWorkSufficient &&
    !input.groupAuditorObtainedEvidence
  )
    return {
      additionalGroupWorkRequired: true,
      decision: "additional_group_work",
      reasons: ["component_work_insufficient", "group_evidence_not_obtained"],
    };
  return {
    additionalGroupWorkRequired: false,
    decision: "professional_judgment",
    reasons: ["component_evidence_requirements_incomplete"],
  };
};

export const componentAuditorWorkExample = {
  input: {
    componentAuditorWorkSufficient: true,
    groupAuditorObtainedEvidence: true,
    instructionsClear: true,
    materialComponent: true,
  },
  output: {
    additionalGroupWorkRequired: false,
    decision: "use_component_work",
    reasons: [],
  },
} satisfies ToolExample<ComponentAuditorWorkInput, ComponentAuditorWorkOutput>;

export const componentAuditorWorkTool = createSimpleTool({
  calculate: (input) =>
    decideComponentAuditorWorkUsage({
      componentAuditorWorkSufficient:
        input.componentAuditorWorkSufficient as boolean,
      groupAuditorObtainedEvidence:
        input.groupAuditorObtainedEvidence as boolean,
      instructionsClear: input.instructionsClear as boolean,
      materialComponent: input.materialComponent as boolean,
    }),
  description:
    "Route supplied component-auditor work and group-auditor evidence facts to use-component-work, additional-group-work, or professional-judgment categories.",
  id: "auditing/component-auditor-work-reference-usage-decision-lookup",
  inputs: [
    {
      id: "componentAuditorWorkSufficient",
      kind: "boolean",
      label: "Component work sufficient",
    },
    {
      id: "groupAuditorObtainedEvidence",
      kind: "boolean",
      label: "Group auditor obtained evidence",
    },
    { id: "instructionsClear", kind: "boolean", label: "Instructions clear" },
    { id: "materialComponent", kind: "boolean", label: "Material component" },
  ],
  outputs: [
    {
      id: "additionalGroupWorkRequired",
      kind: "boolean",
      label: "Additional group work required",
    },
    {
      enum: [
        "additional_group_work",
        "professional_judgment",
        "use_component_work",
      ],
      id: "decision",
      kind: "string",
      label: "Work-usage decision",
    },
    { id: "reasons", kind: "stringList", label: "Decision reasons" },
  ],
  title: "Component Auditor Work Reference Usage Decision Lookup",
});

export const runComponentAuditorWork = componentAuditorWorkTool.execute;
export default componentAuditorWorkTool;
