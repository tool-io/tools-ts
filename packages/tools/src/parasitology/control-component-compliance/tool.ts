import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requiredComponents: readonly string[];
  readonly completedComponents: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingComponents: readonly string[];
  readonly compliancePercent: number;
  readonly complete: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    !input.requiredComponents.length ||
    new Set(input.requiredComponents).size !== input.requiredComponents.length
  )
    simpleError(
      "requiredComponents",
      "Distinct required control components required.",
    );
  const completed = new Set(input.completedComponents),
    missingComponents = input.requiredComponents.filter(
      (v) => !completed.has(v),
    );
  return {
    missingComponents,
    compliancePercent:
      (100 * (input.requiredComponents.length - missingComponents.length)) /
      input.requiredComponents.length,
    complete: missingComponents.length === 0,
  };
};
export const exampleInput = {
  requiredComponents: ["nets", "surveillance", "treatment"],
  completedComponents: ["nets", "treatment"],
} satisfies Input;
export const exampleOutput = {
  missingComponents: ["surveillance"],
  compliancePercent: 66.66666666666667,
  complete: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/control-component-compliance",
  title: "Control Component Compliance",
  description:
    "Audit reported completion of caller-defined integrated parasite-control components.",
  inputs: [
    {
      id: "requiredComponents",
      label: "Required components",
      kind: "stringList",
    },
    {
      id: "completedComponents",
      label: "Completed components",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "missingComponents",
      label: "Missing components",
      kind: "stringList",
    },
    { id: "compliancePercent", label: "Compliance percent", kind: "number" },
    { id: "complete", label: "Complete", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      requiredComponents: value.requiredComponents as readonly string[],
      completedComponents: value.completedComponents as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
