import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { numberAverageMolarMass: 100000, repeatUnitMolarMass: 100 },
  output: { degreeOfPolymerization: 1000 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/polymer-degree-polymerization",
  title: "Number-Average Degree of Polymerization",
  description:
    "Estimate number-average polymerization degree as number-average molecular mass divided by repeat-unit molar mass. Both masses must use the same unit; end-group mass is neglected.",
  inputs: [
    {
      id: "numberAverageMolarMass",
      kind: "number",
      label: "Number-average molar mass",
      minimum: 0,
    },
    {
      id: "repeatUnitMolarMass",
      kind: "number",
      label: "Repeat-unit molar mass",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "degreeOfPolymerization",
      kind: "number",
      label: "Degree Of Polymerization",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      degreeOfPolymerization: i.numberAverageMolarMass / i.repeatUnitMolarMass,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PolymerDegreePolymerizationInput = Readonly<typeof example.input>;
export type PolymerDegreePolymerizationOutput = Readonly<typeof example.output>;
export const polymerDegreePolymerizationTool = tool;
export const runPolymerDegreePolymerization = tool.execute;
export default tool;
