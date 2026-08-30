import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GroupComponentMaterialityInput = {
  readonly componentAuditorMateriality: number;
  readonly componentSharePercent: number;
  readonly groupMateriality: number;
  readonly instructionsPercent: number;
  readonly tolerance: number;
};

export type GroupComponentMaterialityOutput = {
  readonly allocatedMateriality: number;
  readonly allocationReconciles: boolean;
  readonly auditorMaterialityDifference: number;
  readonly instructionsDifference: number;
};

export const divideGroupComponentMateriality = (
  input: GroupComponentMaterialityInput,
): GroupComponentMaterialityOutput => {
  for (const [field, value] of [
    ["componentAuditorMateriality", input.componentAuditorMateriality],
    ["groupMateriality", input.groupMateriality],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_materiality_value",
      );
  if (!Number.isFinite(input.groupMateriality) || input.groupMateriality === 0)
    simpleError(
      "groupMateriality",
      "Group materiality must be greater than zero.",
      "zero_group_materiality",
    );
  for (const [field, value] of [
    ["componentSharePercent", input.componentSharePercent],
    ["instructionsPercent", input.instructionsPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        `${field} must be from 0 through 100.`,
        "invalid_percentage",
      );
  if (!Number.isFinite(input.tolerance) || input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  const allocatedMateriality =
    (input.groupMateriality * input.componentSharePercent) / 100;
  const instructedMateriality =
    (input.groupMateriality * input.instructionsPercent) / 100;
  const auditorMaterialityDifference =
    input.componentAuditorMateriality - allocatedMateriality;
  const instructionsDifference = instructedMateriality - allocatedMateriality;
  if (
    !Number.isFinite(allocatedMateriality) ||
    !Number.isFinite(auditorMaterialityDifference) ||
    !Number.isFinite(instructionsDifference)
  )
    simpleError(
      "groupMateriality",
      "The materiality allocation is not finite.",
      "result_not_finite",
    );
  return {
    allocatedMateriality,
    allocationReconciles:
      Math.abs(auditorMaterialityDifference) <= input.tolerance &&
      Math.abs(instructionsDifference) <= input.tolerance,
    auditorMaterialityDifference,
    instructionsDifference,
  };
};

export const groupComponentMaterialityExample = {
  input: {
    componentAuditorMateriality: 20_000,
    componentSharePercent: 20,
    groupMateriality: 100_000,
    instructionsPercent: 20,
    tolerance: 100,
  },
  output: {
    allocatedMateriality: 20_000,
    allocationReconciles: true,
    auditorMaterialityDifference: 0,
    instructionsDifference: 0,
  },
} satisfies ToolExample<
  GroupComponentMaterialityInput,
  GroupComponentMaterialityOutput
>;

export const groupComponentMaterialityTool = createSimpleTool({
  calculate: (input) =>
    divideGroupComponentMateriality({
      componentAuditorMateriality: input.componentAuditorMateriality as number,
      componentSharePercent: input.componentSharePercent as number,
      groupMateriality: input.groupMateriality as number,
      instructionsPercent: input.instructionsPercent as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Allocate group materiality to a component by percentage and compare the allocation with component-auditor materiality and group instructions.",
  id: "auditing/group-audit-component-materiality-division-instruction-letter",
  inputs: [
    {
      id: "componentAuditorMateriality",
      kind: "number",
      label: "Component-auditor materiality",
      minimum: 0,
    },
    {
      id: "componentSharePercent",
      kind: "number",
      label: "Component share",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    {
      id: "groupMateriality",
      kind: "number",
      label: "Group materiality",
      minimum: 0,
    },
    {
      id: "instructionsPercent",
      kind: "number",
      label: "Instruction percentage",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    { id: "tolerance", kind: "number", label: "Tolerance", minimum: 0 },
  ],
  outputs: [
    {
      id: "allocatedMateriality",
      kind: "number",
      label: "Allocated materiality",
      minimum: 0,
    },
    {
      id: "allocationReconciles",
      kind: "boolean",
      label: "Allocation reconciled",
    },
    {
      id: "auditorMaterialityDifference",
      kind: "number",
      label: "Auditor materiality difference",
    },
    {
      id: "instructionsDifference",
      kind: "number",
      label: "Instructions difference",
    },
  ],
  title: "Group Audit Component Materiality Division Instruction Letter",
});

export const runGroupComponentMateriality =
  groupComponentMaterialityTool.execute;
export default groupComponentMaterialityTool;
