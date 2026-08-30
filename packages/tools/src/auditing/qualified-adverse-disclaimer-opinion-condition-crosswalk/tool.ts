import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AuditOpinion =
  "adverse" | "disclaimer" | "qualified" | "unmodified";

export type OpinionConditionInput = {
  readonly basis: "misstatement" | "none" | "scope_limitation";
  readonly material: boolean;
  readonly pervasive: boolean;
  readonly selectedOpinion: AuditOpinion;
};

export type OpinionConditionOutput = {
  readonly expectedOpinion: AuditOpinion;
  readonly opinionMatches: boolean;
  readonly selectedOpinion: AuditOpinion;
};

export const mapOpinionCondition = (
  input: OpinionConditionInput,
): OpinionConditionOutput => {
  if (!["misstatement", "none", "scope_limitation"].includes(input.basis))
    simpleError("basis", "Opinion basis is invalid.", "invalid_opinion_basis");
  if (
    !["adverse", "disclaimer", "qualified", "unmodified"].includes(
      input.selectedOpinion,
    )
  )
    simpleError(
      "selectedOpinion",
      "Selected opinion is invalid.",
      "invalid_selected_opinion",
    );
  for (const field of ["material", "pervasive"] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (input.pervasive && !input.material)
    simpleError(
      "pervasive",
      "A pervasive effect must also be material.",
      "inconsistent_opinion_facts",
    );

  const expectedOpinion: AuditOpinion =
    input.basis === "none" || !input.material
      ? "unmodified"
      : !input.pervasive
        ? "qualified"
        : input.basis === "misstatement"
          ? "adverse"
          : "disclaimer";
  return {
    expectedOpinion,
    opinionMatches: input.selectedOpinion === expectedOpinion,
    selectedOpinion: input.selectedOpinion,
  };
};

export const opinionConditionExample = {
  input: {
    basis: "misstatement",
    material: true,
    pervasive: true,
    selectedOpinion: "adverse",
  },
  output: {
    expectedOpinion: "adverse",
    opinionMatches: true,
    selectedOpinion: "adverse",
  },
} satisfies ToolExample<OpinionConditionInput, OpinionConditionOutput>;

export const opinionConditionTool = createSimpleTool({
  calculate: (input) =>
    mapOpinionCondition({
      basis: input.basis as OpinionConditionInput["basis"],
      material: input.material as boolean,
      pervasive: input.pervasive as boolean,
      selectedOpinion: input.selectedOpinion as AuditOpinion,
    }),
  description:
    "Cross-check an audit opinion against the conventional materiality-and-pervasiveness decision model: material misstatements may lead to qualified or adverse opinions, while inability to obtain sufficient evidence may lead to qualified opinions or disclaimers.",
  id: "auditing/qualified-adverse-disclaimer-opinion-condition-crosswalk",
  inputs: [
    {
      enum: ["misstatement", "none", "scope_limitation"],
      id: "basis",
      kind: "string",
      label: "Basis for modification",
    },
    { id: "material", kind: "boolean", label: "Effect material" },
    { id: "pervasive", kind: "boolean", label: "Effect pervasive" },
    {
      enum: ["adverse", "disclaimer", "qualified", "unmodified"],
      id: "selectedOpinion",
      kind: "string",
      label: "Selected opinion",
    },
  ],
  outputs: [
    {
      enum: ["adverse", "disclaimer", "qualified", "unmodified"],
      id: "expectedOpinion",
      kind: "string",
      label: "Expected opinion",
    },
    {
      id: "opinionMatches",
      kind: "boolean",
      label: "Selection matches conditions",
    },
    {
      enum: ["adverse", "disclaimer", "qualified", "unmodified"],
      id: "selectedOpinion",
      kind: "string",
      label: "Selected opinion",
    },
  ],
  title: "Qualified Adverse Disclaimer Opinion Condition Crosswalk",
});

export const runOpinionCondition = opinionConditionTool.execute;
export default opinionConditionTool;
