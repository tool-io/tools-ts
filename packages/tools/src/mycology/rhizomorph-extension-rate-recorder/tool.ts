import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const rhizomorphRateRecorderExample = {
  input: { daysElapsedInt: 10, extensionMm: 45 },
  output: { rhizomorphExtensionMmPerDay: 4.5 },
} satisfies ToolExample<
  { readonly daysElapsedInt: number; readonly extensionMm: number },
  { readonly rhizomorphExtensionMmPerDay: number }
>;

export const rhizomorphRateRecorderTool = createSimpleTool({
  id: "mycology/rhizomorph-extension-rate-recorder",
  title: "Rhizomorph Extension Rate",
  description:
    "Record the daily extension rate of a rhizomorph from measured extension over elapsed days.",
  inputs: [
    {
      id: "extensionMm",
      kind: "number",
      label: "Extension",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "daysElapsedInt",
      kind: "integer",
      label: "Days elapsed",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "rhizomorphExtensionMmPerDay",
      kind: "number",
      minimum: 0,
      label: "Extension rate",
      unit: "mm/day",
    },
  ],
  calculate: (input) => ({
    rhizomorphExtensionMmPerDay:
      (input.extensionMm as number) / (input.daysElapsedInt as number),
  }),
});
export const runRhizomorphRateRecorder = rhizomorphRateRecorderTool.execute;
export default rhizomorphRateRecorderTool;
