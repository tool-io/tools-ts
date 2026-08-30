import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrywallCornerBeadLengthInput = Readonly<{
  readonly netCornerMeters: number;
  readonly wastePercent: number;
}>;
export type DrywallCornerBeadLengthOutput = Readonly<{
  readonly purchaseMeters: number;
}>;

export const calculateDrywallCornerBeadLength = (
  x: DrywallCornerBeadLengthInput,
): DrywallCornerBeadLengthOutput => {
  if (!Number.isFinite(x.netCornerMeters) || x.netCornerMeters < 0)
    simpleError("netCornerMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const purchaseMeters = x.netCornerMeters * (1 + x.wastePercent / 100);
  if (!Number.isFinite(purchaseMeters))
    simpleError(
      "purchaseMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { purchaseMeters: Object.is(purchaseMeters, -0) ? 0 : purchaseMeters };
};

export const example = {
  input: { netCornerMeters: 20, wastePercent: 10 },
  output: { purchaseMeters: 22 },
} satisfies ToolExample<
  DrywallCornerBeadLengthInput,
  DrywallCornerBeadLengthOutput
>;

export const tool = createSimpleTool({
  id: "construction/drywall-corner-bead-length",
  title: "Drywall Corner Bead Length",
  description:
    "Corner-bead purchase length from total exposed corner length and a selected cutting-waste allowance.",
  inputs: [
    {
      id: "netCornerMeters",
      kind: "number",
      label: "Net Corner Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste Percent",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "purchaseMeters",
      kind: "number",
      label: "Purchase Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateDrywallCornerBeadLength({
      netCornerMeters: input.netCornerMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const drywallCornerBeadLengthTool = tool;
export const runDrywallCornerBeadLength = tool.execute;
export default tool;
