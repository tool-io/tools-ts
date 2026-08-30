import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CompensatingControlInput = {
  readonly compensatingControls: ReadonlyArray<string>;
  readonly coversGap: boolean;
  readonly gapDescription: string;
  readonly operatedEffectively: boolean;
};

export type CompensatingControlOutput = {
  readonly controlCount: number;
  readonly gapCovered: boolean;
  readonly status: "covered" | "partial" | "uncovered";
};

export const assessCompensatingControlCoverage = (
  input: CompensatingControlInput,
): CompensatingControlOutput => {
  if (
    typeof input.gapDescription !== "string" ||
    input.gapDescription.trim() === ""
  )
    simpleError(
      "gapDescription",
      "A nonempty control-gap description is required.",
      "gap_description_required",
    );
  for (const field of ["coversGap", "operatedEffectively"] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (!Array.isArray(input.compensatingControls))
    simpleError(
      "compensatingControls",
      "Compensating controls must be an array.",
      "compensating_controls_required",
    );
  for (const [index, control] of input.compensatingControls.entries())
    if (typeof control !== "string" || control.trim() === "")
      simpleError(
        `compensatingControls.${index}`,
        "Each compensating control must be a nonempty label.",
        "invalid_compensating_control",
      );
  const hasControl = input.compensatingControls.length > 0;
  const gapCovered = hasControl && input.coversGap && input.operatedEffectively;
  return {
    controlCount: input.compensatingControls.length,
    gapCovered,
    status: gapCovered
      ? "covered"
      : hasControl && input.coversGap
        ? "partial"
        : "uncovered",
  };
};

export const compensatingControlExample = {
  input: {
    compensatingControls: ["Daily exception report review"],
    coversGap: true,
    gapDescription: "Segregation of duties cannot be maintained",
    operatedEffectively: false,
  },
  output: { controlCount: 1, gapCovered: false, status: "partial" },
} satisfies ToolExample<CompensatingControlInput, CompensatingControlOutput>;

export const compensatingControlTool = createSimpleTool({
  calculate: (input) =>
    assessCompensatingControlCoverage({
      compensatingControls: input.compensatingControls as string[],
      coversGap: input.coversGap as boolean,
      gapDescription: input.gapDescription as string,
      operatedEffectively: input.operatedEffectively as boolean,
    }),
  description:
    "Classify a control gap as covered, partially addressed, or uncovered using supplied controls, coverage, and operating-effectiveness facts.",
  id: "auditing/compensating-control-gap-cover-example-lookup",
  inputs: [
    {
      id: "compensatingControls",
      kind: "stringList",
      label: "Compensating controls",
    },
    { id: "coversGap", kind: "boolean", label: "Controls cover gap" },
    { id: "gapDescription", kind: "string", label: "Control gap" },
    {
      id: "operatedEffectively",
      kind: "boolean",
      label: "Controls operated effectively",
    },
  ],
  outputs: [
    {
      id: "controlCount",
      kind: "integer",
      label: "Compensating controls",
      minimum: 0,
    },
    { id: "gapCovered", kind: "boolean", label: "Gap covered" },
    {
      enum: ["covered", "partial", "uncovered"],
      id: "status",
      kind: "string",
      label: "Coverage status",
    },
  ],
  title: "Compensating Control Gap Cover Lookup",
});

export const runCompensatingControl = compensatingControlTool.execute;
export default compensatingControlTool;
