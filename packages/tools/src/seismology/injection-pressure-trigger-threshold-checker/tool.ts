import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const injectionPressureTriggerThresholdCheckerExample = {
  input: { wellheadPressureBar: 2.5, thresholdBar: 1 },
  output: {
    exceedsThreshold: true,
    recommendedAction: "reduce rate and review monitoring catalog",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const injectionPressureTriggerThresholdCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ wellheadPressureBar, thresholdBar }) => {
      const exceedsThreshold = wellheadPressureBar > (thresholdBar ?? 1);
      return {
        exceedsThreshold,
        recommendedAction: exceedsThreshold
          ? "reduce rate and review monitoring catalog"
          : "continue with standard monitoring",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Screen injection wellhead pressure against a pore-pressure perturbation threshold.",
  id: "seismology/injection-pressure-trigger-threshold-checker",
  inputs: [
    {
      minimum: 0,
      description: "Wellhead injection pressure.",
      id: "wellheadPressureBar",
      kind: "number",
      label: "P_w",
      unit: "bar",
    },
    {
      default: 1,
      description: "Trigger threshold above ambient.",
      id: "thresholdBar",
      kind: "number",
      label: "P_thr",
      unit: "bar",
    },
  ],
  outputs: [
    {
      description: "Whether pressure crosses the screening threshold.",
      id: "exceedsThreshold",
      kind: "boolean",
      label: "Exceeds?",
    },
    {
      description: "Traffic-light protocol action.",
      id: "recommendedAction",
      kind: "string",
      label: "Action",
    },
  ],
  title: "Injection Pressure Trigger Threshold Checker",
});
export const runInjectionPressureTriggerThresholdChecker =
  injectionPressureTriggerThresholdCheckerTool.execute;
export { injectionPressureTriggerThresholdCheckerExample as example };
export default injectionPressureTriggerThresholdCheckerTool;
