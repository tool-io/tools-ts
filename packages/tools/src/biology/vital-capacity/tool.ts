import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const vitalCapacityExample = {
  input: {
    expiratoryReserveL: 1.5,
    inspiratoryReserveL: 2.5,
    tidalVolumeL: 0.5,
  },
  output: { vitalCapacityL: 4.5 },
} satisfies ToolExample<
  {
    readonly expiratoryReserveL: number;
    readonly inspiratoryReserveL: number;
    readonly tidalVolumeL: number;
  },
  { readonly vitalCapacityL: number }
>;

export const vitalCapacityTool = createSimpleTool({
  id: "biology/vital-capacity",
  title: "Vital Capacity",
  description:
    "Compute vital capacity in litres as inspiratory reserve + tidal volume + expiratory reserve.",
  inputs: [
    {
      id: "inspiratoryReserveL",
      kind: "number",
      label: "Inspiratory reserve volume",
      minimum: 0,
      unit: "L",
    },
    {
      id: "tidalVolumeL",
      kind: "number",
      label: "Tidal volume",
      minimum: 0,
      unit: "L",
    },
    {
      id: "expiratoryReserveL",
      kind: "number",
      label: "Expiratory reserve volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      id: "vitalCapacityL",
      kind: "number",
      label: "Vital capacity",
      unit: "L",
    },
  ],
  calculate: (input) => ({
    vitalCapacityL:
      (input.inspiratoryReserveL as number) +
      (input.tidalVolumeL as number) +
      (input.expiratoryReserveL as number),
  }),
});
export const runVitalCapacity = vitalCapacityTool.execute;
export default vitalCapacityTool;
