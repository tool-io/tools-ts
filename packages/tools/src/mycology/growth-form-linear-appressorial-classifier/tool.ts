import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GrowthFormLinearAppressorialClassifierInput = {
  readonly pattern:
    "aerial-fluffy" | "appressed-appressorial" | "appressorial" | "linear";
};

export type GrowthFormLinearAppressorialClassifierOutput = {
  readonly growthFormClass: GrowthFormLinearAppressorialClassifierInput["pattern"];
};

export const growthFormLinearAppressorialClassifierExample = {
  input: { pattern: "appressorial" },
  output: { growthFormClass: "appressorial" },
} satisfies ToolExample<
  GrowthFormLinearAppressorialClassifierInput,
  GrowthFormLinearAppressorialClassifierOutput
>;

export const growthFormLinearAppressorialClassifierTool = createSimpleTool({
  id: "mycology/growth-form-linear-appressorial-classifier",
  title: "Growth Form Classifier",
  description:
    "Validate and pass through a recorded mycelial growth form pattern.",
  inputs: [
    {
      enum: [
        "linear",
        "appressorial",
        "aerial-fluffy",
        "appressed-appressorial",
      ],
      id: "pattern",
      kind: "string",
      label: "Growth pattern",
    },
  ],
  outputs: [
    { id: "growthFormClass", label: "Growth form class", kind: "string" },
  ],
  calculate: (input) => ({
    growthFormClass:
      input.pattern as GrowthFormLinearAppressorialClassifierInput["pattern"],
  }),
});
export const runGrowthFormLinearAppressorialClassifier =
  growthFormLinearAppressorialClassifierTool.execute;
export default growthFormLinearAppressorialClassifierTool;
