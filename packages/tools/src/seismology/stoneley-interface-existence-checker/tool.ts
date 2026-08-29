import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const stoneleyInterfaceExistenceCheckerExample = {
  input: { vsUpperKmS: 1.5, vsLowerKmS: 3.5 },
  output: {
    shearSupportConditionMet: true,
    note: "Necessary shear-support condition is met; full elastic properties are required to establish a Stoneley-wave solution.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const stoneleyInterfaceExistenceCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ vsUpperKmS, vsLowerKmS }) => {
      const exists = vsUpperKmS > 0 && vsLowerKmS > 0;
      return {
        shearSupportConditionMet: exists,
        note: exists
          ? "Necessary shear-support condition is met; full elastic properties are required to establish a Stoneley-wave solution."
          : "The shear-support condition fails because at least one side has zero shear-wave speed.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Check the necessary solid-solid shear-support condition for a Stoneley interface wave. Positive shear speeds on both sides are necessary but not sufficient; density and compressional-wave speed are also needed for a full existence test.",
  id: "seismology/stoneley-interface-existence-checker",
  inputs: [
    {
      minimum: 0,
      description: "Shear velocity of the upper medium.",
      id: "vsUpperKmS",
      kind: "number",
      label: "β₁",
      unit: "km/s",
    },
    {
      minimum: 0,
      description: "Shear velocity of the lower medium.",
      id: "vsLowerKmS",
      kind: "number",
      label: "β₂",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description:
        "Whether the necessary two-solid shear-support condition is met.",
      id: "shearSupportConditionMet",
      kind: "boolean",
      label: "Condition met",
    },
    {
      description: "Explanation.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Stoneley Interface Necessary-Condition Checker",
});
export const runStoneleyInterfaceExistenceChecker =
  stoneleyInterfaceExistenceCheckerTool.execute;
export { stoneleyInterfaceExistenceCheckerExample as example };
export default stoneleyInterfaceExistenceCheckerTool;
