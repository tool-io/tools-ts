import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const specificActivityTool = createSimpleTool({
  id: "chemistry/specific-activity",
  title: "Specific Activity Calculator",
  description:
    "Compute the specific activity of a radioactive sample as activity divided by sample mass.",
  inputs: [
    {
      description: "Total activity of the sample.",
      id: "activityBq",
      label: "Activity",
      kind: "number",
      minimum: 0,
      unit: "Bq",
    },
    {
      description: "Mass of the sample; must be greater than zero.",
      id: "sampleMassG",
      label: "Sample mass",
      kind: "number",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Activity per gram of sample.",
      id: "bqPerGram",
      label: "Specific activity",
      kind: "number",
      unit: "Bq/g",
    },
  ],
  calculate: (input) => {
    const mass = input.sampleMassG as number;
    if (mass <= 0)
      simpleError(
        "sampleMassG",
        "The sample mass must be greater than zero.",
        "invalid_mass",
      );
    return { bqPerGram: (input.activityBq as number) / mass };
  },
});
export const runSpecificActivity = specificActivityTool.execute;
export default specificActivityTool;

export type SpecificActivityInput = {
  readonly activityBq: number;
  readonly sampleMassG: number;
};

export type SpecificActivityOutput = {
  readonly bqPerGram: number;
};

export const specificActivityExample = {
  input: {
    activityBq: 1,
    sampleMassG: 1,
  },
  output: {
    bqPerGram: 1,
  },
} satisfies ToolExample<SpecificActivityInput, SpecificActivityOutput>;
