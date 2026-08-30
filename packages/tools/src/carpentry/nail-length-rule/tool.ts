import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NailLengthRuleInput = Readonly<{
  readonly faceBoardMillimeters: number;
  readonly penetrationMillimeters: number;
}>;
export type NailLengthRuleOutput = Readonly<{
  readonly minimumNailMillimeters: number;
}>;

export const calculateNailLengthRule = (
  x: NailLengthRuleInput,
): NailLengthRuleOutput => {
  if (!Number.isFinite(x.faceBoardMillimeters) || x.faceBoardMillimeters < 0)
    simpleError("faceBoardMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.penetrationMillimeters) ||
    x.penetrationMillimeters < 0
  )
    simpleError(
      "penetrationMillimeters",
      "Provide a finite number at least 0.",
    );
  const minimumNailMillimeters =
    x.faceBoardMillimeters + x.penetrationMillimeters;
  if (!Number.isFinite(minimumNailMillimeters))
    simpleError(
      "minimumNailMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    minimumNailMillimeters: Object.is(minimumNailMillimeters, -0)
      ? 0
      : minimumNailMillimeters,
  };
};

export const example = {
  input: { faceBoardMillimeters: 20, penetrationMillimeters: 40 },
  output: { minimumNailMillimeters: 60 },
} satisfies ToolExample<NailLengthRuleInput, NailLengthRuleOutput>;

export const tool = createSimpleTool({
  id: "carpentry/nail-length-rule",
  title: "Nail Length Rule",
  description:
    "Minimum nail length from the thickness of the attached board and a separately chosen penetration depth into the receiving member; not a withdrawal-capacity check.",
  inputs: [
    {
      id: "faceBoardMillimeters",
      kind: "number",
      label: "Face Board Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "penetrationMillimeters",
      kind: "number",
      label: "Penetration Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "minimumNailMillimeters",
      kind: "number",
      label: "Minimum Nail Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateNailLengthRule({
      faceBoardMillimeters: input.faceBoardMillimeters as number,
      penetrationMillimeters: input.penetrationMillimeters as number,
    }),
});
export const nailLengthRuleTool = tool;
export const runNailLengthRule = tool.execute;
export default tool;
