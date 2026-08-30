import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IndependenceSafeguardsInput = {
  readonly implementedSafeguards: ReadonlyArray<string>;
  readonly independenceApproved: boolean;
  readonly requiredSafeguards: ReadonlyArray<string>;
};

export type IndependenceSafeguardsOutput = {
  readonly implementedCount: number;
  readonly independenceConfirmed: boolean;
  readonly missingCount: number;
  readonly missingSafeguards: ReadonlyArray<string>;
};

const normalize = (values: ReadonlyArray<string>, field: string): string[] => {
  if (!Array.isArray(values))
    simpleError(field, `${field} must be an array.`, "safeguard_list_required");
  return values.map((value, index) => {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        `${field}.${index}`,
        "Safeguard labels must be nonempty strings.",
        "invalid_safeguard",
      );
    return value.trim().toLowerCase();
  });
};

export const classifyIndependenceSafeguards = (
  input: IndependenceSafeguardsInput,
): IndependenceSafeguardsOutput => {
  if (typeof input.independenceApproved !== "boolean")
    simpleError(
      "independenceApproved",
      "Independence approval must be a boolean.",
      "approval_flag_required",
    );
  const required = new Set(
    normalize(input.requiredSafeguards, "requiredSafeguards"),
  );
  if (required.size === 0)
    simpleError(
      "requiredSafeguards",
      "At least one required safeguard is needed.",
      "required_safeguards_required",
    );
  const implemented = new Set(
    normalize(input.implementedSafeguards, "implementedSafeguards"),
  );
  const missingSafeguards = [...required]
    .filter((safeguard) => !implemented.has(safeguard))
    .sort();
  return {
    implementedCount: implemented.size,
    independenceConfirmed:
      input.independenceApproved && missingSafeguards.length === 0,
    missingCount: missingSafeguards.length,
    missingSafeguards,
  };
};

export const independenceSafeguardsExample = {
  input: {
    implementedSafeguards: ["independent review", "documentation"],
    independenceApproved: true,
    requiredSafeguards: [
      "documentation",
      "independent review",
      "second partner review",
    ],
  },
  output: {
    implementedCount: 2,
    independenceConfirmed: false,
    missingCount: 1,
    missingSafeguards: ["second partner review"],
  },
} satisfies ToolExample<
  IndependenceSafeguardsInput,
  IndependenceSafeguardsOutput
>;

export const independenceSafeguardsTool = createSimpleTool({
  calculate: (input) =>
    classifyIndependenceSafeguards({
      implementedSafeguards: input.implementedSafeguards as string[],
      independenceApproved: input.independenceApproved as boolean,
      requiredSafeguards: input.requiredSafeguards as string[],
    }),
  description:
    "Classify independence as confirmed only when approval is recorded and every caller-supplied required safeguard is implemented.",
  id: "auditing/independence-threat-safeguards-classifier",
  inputs: [
    {
      description: "Safeguards already implemented for the identified threat.",
      id: "implementedSafeguards",
      kind: "stringList",
      label: "Implemented safeguards",
    },
    {
      description: "Whether the engagement lead approved independence.",
      id: "independenceApproved",
      kind: "boolean",
      label: "Independence approved",
    },
    {
      description: "Safeguards required to resolve the identified threat.",
      id: "requiredSafeguards",
      kind: "stringList",
      label: "Required safeguards",
    },
  ],
  outputs: [
    {
      id: "implementedCount",
      kind: "integer",
      label: "Implemented safeguards",
      minimum: 0,
    },
    {
      id: "independenceConfirmed",
      kind: "boolean",
      label: "Independence confirmed",
    },
    {
      id: "missingCount",
      kind: "integer",
      label: "Missing safeguards",
      minimum: 0,
    },
    {
      id: "missingSafeguards",
      kind: "stringList",
      label: "Missing safeguard labels",
    },
  ],
  title: "Independence Threat Safeguards Classifier",
});

export const runIndependenceSafeguards = independenceSafeguardsTool.execute;
export default independenceSafeguardsTool;
