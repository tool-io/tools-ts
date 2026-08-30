import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AerationRequirementInput = Readonly<{
  readonly oxygenDemandKgPerHour: number;
  readonly fieldTransferEfficiencyPercent: number;
}>;
export type AerationRequirementOutput = Readonly<{
  readonly ratedOxygenTransferKgPerHour: number;
}>;

export const calculateAerationRequirement = (
  x: AerationRequirementInput,
): AerationRequirementOutput => {
  if (!Number.isFinite(x.oxygenDemandKgPerHour) || x.oxygenDemandKgPerHour < 0)
    simpleError(
      "oxygenDemandKgPerHour",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.fieldTransferEfficiencyPercent) ||
    x.fieldTransferEfficiencyPercent < 0 ||
    x.fieldTransferEfficiencyPercent > 100
  )
    simpleError(
      "fieldTransferEfficiencyPercent",
      "Provide a finite nonnegative number no greater than 100.",
    );
  if (x.fieldTransferEfficiencyPercent <= 0)
    simpleError(
      "fieldTransferEfficiencyPercent",
      "Field transfer efficiency must be positive.",
    );
  const ratedOxygenTransferKgPerHour =
    x.oxygenDemandKgPerHour / (x.fieldTransferEfficiencyPercent / 100);
  if (!Number.isFinite(ratedOxygenTransferKgPerHour))
    simpleError(
      "ratedOxygenTransferKgPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    ratedOxygenTransferKgPerHour: Object.is(ratedOxygenTransferKgPerHour, -0)
      ? 0
      : ratedOxygenTransferKgPerHour,
  };
};

export const example = {
  input: {
    oxygenDemandKgPerHour: 5,
    fieldTransferEfficiencyPercent: 50,
  },
  output: { ratedOxygenTransferKgPerHour: 10 },
} satisfies ToolExample<AerationRequirementInput, AerationRequirementOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/aeration-requirement",
  title: "Aeration Requirement",
  description:
    "Find rated aerator oxygen transfer needed at a user-supplied field transfer efficiency; allow for other oxygen sinks separately.",
  inputs: [
    {
      id: "oxygenDemandKgPerHour",
      kind: "number",
      label: "Oxygen Demand Kg Per Hour",
      unit: "kg/h",
    },
    {
      id: "fieldTransferEfficiencyPercent",
      kind: "number",
      label: "Field Transfer Efficiency Percent",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "ratedOxygenTransferKgPerHour",
      kind: "number",
      label: "Rated Oxygen Transfer Kg Per Hour",
      unit: "kg/h",
    },
  ],
  calculate: (input) =>
    calculateAerationRequirement({
      oxygenDemandKgPerHour: input.oxygenDemandKgPerHour as number,
      fieldTransferEfficiencyPercent:
        input.fieldTransferEfficiencyPercent as number,
    }),
});
export const runAerationRequirement = tool.execute;
export default tool;
