import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConduitFillPercentageInput = Readonly<{
  readonly conductorAreaMm2: number;
  readonly conduitInnerAreaMm2: number;
}>;
export type ConduitFillPercentageOutput = Readonly<{
  readonly fillPercent: number;
}>;

export const calculateConduitFillPercentage = (
  x: ConduitFillPercentageInput,
): ConduitFillPercentageOutput => {
  if (!Number.isFinite(x.conductorAreaMm2) || x.conductorAreaMm2 < 0)
    simpleError("conductorAreaMm2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.conduitInnerAreaMm2) || x.conduitInnerAreaMm2 < 0)
    simpleError("conduitInnerAreaMm2", "Provide a finite number at least 0.");
  if (!(
    x.conduitInnerAreaMm2 > 0 && x.conductorAreaMm2 <= x.conduitInnerAreaMm2
  ))
    simpleError(
      "conduitInnerAreaMm2",
      "Conduit area must be positive and at least conductor area.",
    );
  const fillPercent = (100 * x.conductorAreaMm2) / x.conduitInnerAreaMm2;
  if (!Number.isFinite(fillPercent))
    simpleError("fillPercent", "The inputs produce an invalid result.");
  return { fillPercent: Object.is(fillPercent, -0) ? 0 : fillPercent };
};

export const example = {
  input: { conductorAreaMm2: 100, conduitInnerAreaMm2: 400 },
  output: { fillPercent: 25 },
} satisfies ToolExample<
  ConduitFillPercentageInput,
  ConduitFillPercentageOutput
>;

export const tool = createSimpleTool({
  id: "construction/conduit-fill-percentage",
  title: "Conduit Fill Percentage",
  description:
    "Calculate conduit fill area percentage from combined conductor cross-sectional area and usable conduit area; does not select a code limit.",
  inputs: [
    {
      id: "conductorAreaMm2",
      kind: "number",
      label: "Total conductor area",
      unit: "mm²",
      minimum: 0,
    },
    {
      id: "conduitInnerAreaMm2",
      kind: "number",
      label: "Conduit inner area",
      unit: "mm²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "fillPercent", kind: "number", label: "Conduit fill", unit: "%" },
  ],
  calculate: (input) =>
    calculateConduitFillPercentage({
      conductorAreaMm2: input.conductorAreaMm2 as number,
      conduitInnerAreaMm2: input.conduitInnerAreaMm2 as number,
    }),
});
export const conduitFillPercentageTool = tool;
export const runConduitFillPercentage = tool.execute;
export default tool;
