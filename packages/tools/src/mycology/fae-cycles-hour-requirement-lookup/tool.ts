import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const faeCyclesHourRequirementLookupExample = {
  input: {
    fanCyclesInt: 12,
    observationHoursInt: 3,
    targetFanCyclesPerHour: 4,
  },
  output: { fanCyclesPerHour: 4, meetsCycleTarget: true },
} satisfies ToolExample<
  {
    readonly fanCyclesInt: number;
    readonly observationHoursInt: number;
    readonly targetFanCyclesPerHour: number;
  },
  {
    readonly fanCyclesPerHour: number;
    readonly meetsCycleTarget: boolean;
  }
>;

export const faeCyclesHourRequirementLookupTool = createSimpleTool({
  id: "mycology/fae-cycles-hour-requirement-lookup",
  title: "FAE Cycles Requirement",
  description:
    "Compute fan cycles per hour and compare the rate with a caller-supplied target; a fan cycle is not an air exchange unless airflow and chamber volume establish that equivalence.",
  inputs: [
    { id: "fanCyclesInt", label: "Fan cycles", kind: "integer", minimum: 0 },
    {
      id: "observationHoursInt",
      label: "Observation hours",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "targetFanCyclesPerHour",
      label: "Target fan cycles per hour",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fanCyclesPerHour",
      label: "Fan cycles per hour",
      kind: "number",
    },
    {
      id: "meetsCycleTarget",
      label: "Meets cycle target",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const fanCyclesPerHour =
      (input.fanCyclesInt as number) / (input.observationHoursInt as number);
    return {
      fanCyclesPerHour,
      meetsCycleTarget:
        fanCyclesPerHour >= (input.targetFanCyclesPerHour as number),
    };
  },
});
export const runFaeCyclesHourRequirementLookup =
  faeCyclesHourRequirementLookupTool.execute;
export default faeCyclesHourRequirementLookupTool;
