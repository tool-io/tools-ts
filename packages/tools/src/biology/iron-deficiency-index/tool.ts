import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type IronDeficiencyIndexInput = {
  readonly ferritinNgMl: number;
  readonly transferrinSaturationPercent: number;
};

export type IronDeficiencyIndexOutput = {
  readonly ironDeficient: boolean;
};

export const ironDeficiencyIndexExample = {
  input: { ferritinNgMl: 12, transferrinSaturationPercent: 15 },
  output: { ironDeficient: true },
} satisfies ToolExample<IronDeficiencyIndexInput, IronDeficiencyIndexOutput>;

export const ironDeficiencyIndexTool = createSimpleTool({
  id: "biology/iron-deficiency-index",
  title: "Iron Deficiency Indicator",
  description:
    "Flag iron deficiency when ferritin is below thirty nanograms per millilitre and transferrin saturation is below twenty percent.",
  inputs: [
    {
      id: "ferritinNgMl",
      label: "Ferritin",
      kind: "number",
      minimum: 0,
      unit: "ng/mL",
    },
    {
      id: "transferrinSaturationPercent",
      label: "Transferrin saturation",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [{ id: "ironDeficient", label: "Iron deficient", kind: "boolean" }],
  calculate: (input) => ({
    ironDeficient:
      (input.ferritinNgMl as number) < 30 &&
      (input.transferrinSaturationPercent as number) < 20,
  }),
});
export const runIronDeficiencyIndex = ironDeficiencyIndexTool.execute;
export default ironDeficiencyIndexTool;
