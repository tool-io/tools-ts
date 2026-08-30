import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HolzQuellungInput = Readonly<{
  readonly initialWidthMillimeters: number;
  readonly initialMoisturePercent: number;
  readonly finalMoisturePercent: number;
  readonly movementPerPercentagePoint: number;
}>;
export type HolzQuellungOutput = Readonly<{
  readonly swellingMillimeters: number;
}>;

export const calculateHolzQuellung = (
  x: HolzQuellungInput,
): HolzQuellungOutput => {
  if (
    !Number.isFinite(x.initialWidthMillimeters) ||
    x.initialWidthMillimeters < 0
  )
    simpleError(
      "initialWidthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.initialMoisturePercent) ||
    x.initialMoisturePercent < 0
  )
    simpleError(
      "initialMoisturePercent",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.finalMoisturePercent) || x.finalMoisturePercent < 0)
    simpleError("finalMoisturePercent", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.movementPerPercentagePoint) ||
    x.movementPerPercentagePoint < 0
  )
    simpleError(
      "movementPerPercentagePoint",
      "Provide a finite number at least 0.",
    );
  if (x.finalMoisturePercent < x.initialMoisturePercent)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const swellingMillimeters =
    x.initialWidthMillimeters *
    (x.finalMoisturePercent - x.initialMoisturePercent) *
    x.movementPerPercentagePoint;
  if (!Number.isFinite(swellingMillimeters))
    simpleError(
      "swellingMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    swellingMillimeters: Object.is(swellingMillimeters, -0)
      ? 0
      : swellingMillimeters,
  };
};

export const example = {
  input: {
    initialWidthMillimeters: 200,
    initialMoisturePercent: 8,
    finalMoisturePercent: 12,
    movementPerPercentagePoint: 0.002,
  },
  output: { swellingMillimeters: 1.6 },
} satisfies ToolExample<HolzQuellungInput, HolzQuellungOutput>;

export const tool = createSimpleTool({
  id: "carpentry/holz-quellung",
  title: "Holz Quellung",
  description:
    "Expected across-grain wood swelling over a rising dry-basis moisture content, using a species- and direction-specific measured movement coefficient.",
  inputs: [
    {
      id: "initialWidthMillimeters",
      kind: "number",
      label: "Initial Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "initialMoisturePercent",
      kind: "number",
      label: "Initial Moisture Percent",
      unit: "%",
      minimum: 0,
    },
    {
      id: "finalMoisturePercent",
      kind: "number",
      label: "Final Moisture Percent",
      unit: "%",
      minimum: 0,
    },
    {
      id: "movementPerPercentagePoint",
      kind: "number",
      label: "Movement Per Percentage Point",
      unit: "1/%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "swellingMillimeters",
      kind: "number",
      label: "Swelling Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateHolzQuellung({
      initialWidthMillimeters: input.initialWidthMillimeters as number,
      initialMoisturePercent: input.initialMoisturePercent as number,
      finalMoisturePercent: input.finalMoisturePercent as number,
      movementPerPercentagePoint: input.movementPerPercentagePoint as number,
    }),
});
export const holzQuellungTool = tool;
export const runHolzQuellung = tool.execute;
export default tool;
