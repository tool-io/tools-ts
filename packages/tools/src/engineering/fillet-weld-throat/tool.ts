import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FilletWeldThroatInput = Readonly<{
  readonly legMillimeters: number;
}>;
export type FilletWeldThroatOutput = Readonly<{
  readonly throatMillimeters: number;
}>;

export const calculateFilletWeldThroat = (
  x: FilletWeldThroatInput,
): FilletWeldThroatOutput => {
  if (!Number.isFinite(x.legMillimeters) || x.legMillimeters < 0)
    simpleError("legMillimeters", "Provide a finite number at least 0.");
  const throatMillimeters = x.legMillimeters / Math.sqrt(2);
  if (!Number.isFinite(throatMillimeters))
    simpleError(
      "throatMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    throatMillimeters: Object.is(throatMillimeters, -0) ? 0 : throatMillimeters,
  };
};

export const example = {
  input: { legMillimeters: 5 },
  output: { throatMillimeters: 3.5355339059327373 },
} satisfies ToolExample<FilletWeldThroatInput, FilletWeldThroatOutput>;

export const tool = createSimpleTool({
  id: "engineering/fillet-weld-throat",
  title: "Fillet Weld Throat",
  description:
    "Effective throat thickness of an equal-leg 45° fillet weld: leg size divided by √2.",
  inputs: [
    {
      id: "legMillimeters",
      kind: "number",
      label: "Leg Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "throatMillimeters",
      kind: "number",
      label: "Throat Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFilletWeldThroat({
      legMillimeters: input.legMillimeters as number,
    }),
});
export const filletWeldThroatTool = tool;
export const runFilletWeldThroat = tool.execute;
export default tool;
