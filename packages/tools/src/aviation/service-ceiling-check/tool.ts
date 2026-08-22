import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ServiceCeilingCheckInput = {
  readonly plannedAltitudeFt: number;
  readonly serviceCeilingFt: number;
};

export type ServiceCeilingCheckOutput = {
  readonly marginFt: number;
  readonly withinServiceCeiling: boolean;
};

export const serviceCeilingCheckExample = {
  input: { plannedAltitudeFt: 10000, serviceCeilingFt: 12500 },
  output: { marginFt: 2500, withinServiceCeiling: true },
} satisfies ToolExample<ServiceCeilingCheckInput, ServiceCeilingCheckOutput>;

export const calculateServiceCeilingCheck = (
  input: ServiceCeilingCheckInput,
): ServiceCeilingCheckOutput => {
  if (input.serviceCeilingFt <= 0 || input.plannedAltitudeFt < 0)
    simpleError(
      "serviceCeilingFt",
      "Provide a positive ceiling and a non-negative planned altitude.",
      "invalid_input",
    );
  return {
    marginFt: input.serviceCeilingFt - input.plannedAltitudeFt,
    withinServiceCeiling: input.plannedAltitudeFt <= input.serviceCeilingFt,
  };
};

export const serviceCeilingCheckTool = createSimpleTool({
  calculate: (input) =>
    calculateServiceCeilingCheck(input as unknown as ServiceCeilingCheckInput),
  description:
    "Check a planned cruising altitude against the aircraft's published service ceiling.",
  id: "aviation/service-ceiling-check",
  inputs: [
    {
      description: "Planned cruising altitude.",
      id: "plannedAltitudeFt",
      kind: "number",
      label: "Planned altitude",
      unit: "ft",
    },
    {
      description: "Service ceiling from the pilot handbook.",
      id: "serviceCeilingFt",
      kind: "number",
      label: "Service ceiling",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Whether the planned altitude is at or below the service ceiling.",
      id: "withinServiceCeiling",
      kind: "boolean",
      label: "Within ceiling",
    },
    {
      description:
        "Signed difference between ceiling and planned altitude, in feet.",
      format: "length-ft",
      id: "marginFt",
      kind: "number",
      label: "Margin",
      unit: "ft",
    },
  ],
  title: "Service Ceiling Checker",
});
export const runServiceCeilingCheck = serviceCeilingCheckTool.execute;
export default serviceCeilingCheckTool;
