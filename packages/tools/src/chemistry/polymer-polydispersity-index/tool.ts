import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { weightAverageMolarMass: 120000, numberAverageMolarMass: 100000 },
  output: { dispersity: 1.2 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/polymer-polydispersity-index",
  title: "Polymer Dispersity",
  description:
    "Calculate polymer dispersity Đ=Mw/Mn from weight-average and number-average molar masses. For a valid nonnegative molecular-weight distribution, Mw should not be below Mn.",
  inputs: [
    {
      id: "weightAverageMolarMass",
      kind: "number",
      label: "Weight-average molar mass",
      minimum: 0,
    },
    {
      id: "numberAverageMolarMass",
      kind: "number",
      label: "Number-average molar mass",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "dispersity", kind: "number", label: "dispersity" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.weightAverageMolarMass < i.numberAverageMolarMass)
      simpleError(
        "weightAverageMolarMass",
        "Weight-average mass cannot be below number-average mass.",
      );
    const output = {
      dispersity: i.weightAverageMolarMass / i.numberAverageMolarMass,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PolymerPolydispersityIndexInput = Readonly<typeof example.input>;
export type PolymerPolydispersityIndexOutput = Readonly<typeof example.output>;
export const polymerPolydispersityIndexTool = tool;
export const runPolymerPolydispersityIndex = tool.execute;
export default tool;
