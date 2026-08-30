import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScrewLengthRuleInput = Readonly<{
  readonly firstMemberMillimeters: number;
  readonly embedmentMillimeters: number;
}>;
export type ScrewLengthRuleOutput = Readonly<{
  readonly minimumScrewMillimeters: number;
}>;

export const calculateScrewLengthRule = (
  x: ScrewLengthRuleInput,
): ScrewLengthRuleOutput => {
  if (
    !Number.isFinite(x.firstMemberMillimeters) ||
    x.firstMemberMillimeters < 0
  )
    simpleError(
      "firstMemberMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.embedmentMillimeters) || x.embedmentMillimeters < 0)
    simpleError("embedmentMillimeters", "Provide a finite number at least 0.");
  const minimumScrewMillimeters =
    x.firstMemberMillimeters + x.embedmentMillimeters;
  if (!Number.isFinite(minimumScrewMillimeters))
    simpleError(
      "minimumScrewMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    minimumScrewMillimeters: Object.is(minimumScrewMillimeters, -0)
      ? 0
      : minimumScrewMillimeters,
  };
};

export const example = {
  input: { firstMemberMillimeters: 20, embedmentMillimeters: 30 },
  output: { minimumScrewMillimeters: 50 },
} satisfies ToolExample<ScrewLengthRuleInput, ScrewLengthRuleOutput>;

export const tool = createSimpleTool({
  id: "carpentry/screw-length-rule",
  title: "Screw Length Rule",
  description:
    "Minimum screw length to pass through the first member and reach a specified embedment in the receiving member; excludes countersinking.",
  inputs: [
    {
      id: "firstMemberMillimeters",
      kind: "number",
      label: "First Member Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "embedmentMillimeters",
      kind: "number",
      label: "Embedment Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "minimumScrewMillimeters",
      kind: "number",
      label: "Minimum Screw Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateScrewLengthRule({
      firstMemberMillimeters: input.firstMemberMillimeters as number,
      embedmentMillimeters: input.embedmentMillimeters as number,
    }),
});
export const screwLengthRuleTool = tool;
export const runScrewLengthRule = tool.execute;
export default tool;
