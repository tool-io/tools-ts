import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DigitalLegacyChecklistInput = {
  readonly controlAreas: ReadonlyArray<string>;
  readonly dataSubjectCount: number;
  readonly executorDesignated: boolean;
  readonly retentionYears: number;
};

export type DigitalLegacyChecklistOutput = {
  readonly checklist: ReadonlyArray<string>;
  readonly complete: boolean;
  readonly controlAreaCount: number;
  readonly coveredControlAreas: ReadonlyArray<string>;
};

export const buildDigitalLegacySovereigntyChecklist = (
  input: DigitalLegacyChecklistInput,
): DigitalLegacyChecklistOutput => {
  if (
    !Number.isSafeInteger(input.dataSubjectCount) ||
    input.dataSubjectCount < 0
  )
    simpleError(
      "dataSubjectCount",
      "Data subject count must be a nonnegative integer.",
      "invalid_data_subject_count",
    );
  if (!Number.isSafeInteger(input.retentionYears) || input.retentionYears < 0)
    simpleError(
      "retentionYears",
      "Retention years must be a nonnegative integer.",
      "invalid_retention_years",
    );
  if (!Array.isArray(input.controlAreas))
    simpleError(
      "controlAreas",
      "Control areas must be an array.",
      "control_areas_required",
    );
  const controlAreas = input.controlAreas.map((controlArea, index) => {
    if (typeof controlArea !== "string" || controlArea.trim() === "")
      simpleError(
        `controlAreas.${index}`,
        "Control areas must be nonempty strings.",
        "invalid_control_area",
      );
    return controlArea.trim();
  });
  const uniqueControlAreas = [...new Set(controlAreas)];
  const coreControlAreas = [
    "access",
    "deletion",
    "portability",
    "consent",
    "executor",
  ];
  const coveredControlAreas = coreControlAreas.filter((controlArea) =>
    uniqueControlAreas.some(
      (candidate) => candidate.toLowerCase() === controlArea,
    ),
  );
  const checklist = [
    `Data subjects covered: ${input.dataSubjectCount}`,
    `Retention period: ${input.retentionYears} years`,
    `Executor designated: ${input.executorDesignated ? "yes" : "no"}`,
    ...coreControlAreas.map(
      (controlArea) =>
        `${controlArea}: ${coveredControlAreas.includes(controlArea) ? "covered" : "missing"}`,
    ),
    "Revocation: Record how people can change or withdraw permissions after death.",
  ];
  return {
    checklist,
    complete:
      input.executorDesignated &&
      coveredControlAreas.length === coreControlAreas.length,
    controlAreaCount: uniqueControlAreas.length,
    coveredControlAreas,
  };
};

export const digitalLegacyChecklistExample = {
  input: {
    controlAreas: [
      "access",
      "deletion",
      "portability",
      "consent",
      "executor",
      "security",
    ],
    dataSubjectCount: 1200,
    executorDesignated: true,
    retentionYears: 5,
  },
  output: {
    checklist: [
      "Data subjects covered: 1200",
      "Retention period: 5 years",
      "Executor designated: yes",
      "access: covered",
      "deletion: covered",
      "portability: covered",
      "consent: covered",
      "executor: covered",
      "Revocation: Record how people can change or withdraw permissions after death.",
    ],
    complete: true,
    controlAreaCount: 6,
    coveredControlAreas: [
      "access",
      "deletion",
      "portability",
      "consent",
      "executor",
    ],
  },
} satisfies ToolExample<
  DigitalLegacyChecklistInput,
  DigitalLegacyChecklistOutput
>;

export const digitalLegacyChecklistTool = createSimpleTool({
  calculate: (input) =>
    buildDigitalLegacySovereigntyChecklist({
      controlAreas: input.controlAreas as string[],
      dataSubjectCount: input.dataSubjectCount as number,
      executorDesignated: input.executorDesignated as boolean,
      retentionYears: input.retentionYears as number,
    }),
  description:
    "Build a posthumous data-sovereignty checklist and test coverage of access, deletion, portability, consent, and executor controls.",
  id: "futurology/digital-legacy-posthumous-data-sovereignty-checklist",
  inputs: [
    { id: "controlAreas", kind: "stringList", label: "Control areas" },
    {
      id: "dataSubjectCount",
      kind: "integer",
      label: "Data subject count",
      minimum: 0,
    },
    { id: "executorDesignated", kind: "boolean", label: "Executor designated" },
    {
      id: "retentionYears",
      kind: "integer",
      label: "Retention years",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "checklist", kind: "stringList", label: "Digital legacy checklist" },
    { id: "complete", kind: "boolean", label: "Core controls complete" },
    {
      id: "controlAreaCount",
      kind: "integer",
      label: "Unique control areas",
      minimum: 0,
    },
    {
      id: "coveredControlAreas",
      kind: "stringList",
      label: "Covered core controls",
    },
  ],
  title: "Digital Legacy Posthumous Data Sovereignty Checklist",
});

export const runDigitalLegacyChecklist = digitalLegacyChecklistTool.execute;
export default digitalLegacyChecklistTool;
