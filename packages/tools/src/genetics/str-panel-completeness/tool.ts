import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requiredLoci: readonly string[];
  readonly observedLoci: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingLoci: readonly string[];
  readonly complete: boolean;
  readonly coveragePercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !input.requiredLoci.length ||
    new Set(input.requiredLoci).size !== input.requiredLoci.length
  )
    simpleError(
      "requiredLoci",
      "Distinct required panel loci must be supplied.",
    );
  const observed = new Set(input.observedLoci),
    missingLoci = input.requiredLoci.filter((v) => !observed.has(v));
  return {
    missingLoci,
    complete: missingLoci.length === 0,
    coveragePercent:
      (100 * (input.requiredLoci.length - missingLoci.length)) /
      input.requiredLoci.length,
  };
};
export const exampleInput = {
  requiredLoci: ["D3S1358", "vWA", "FGA"],
  observedLoci: ["vWA", "FGA"],
} satisfies Input;
export const exampleOutput = {
  missingLoci: ["D3S1358"],
  complete: false,
  coveragePercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/str-panel-completeness",
  title: "STR Panel Completeness",
  description:
    "Audit STR panel completeness against a caller-supplied locus set, not an embedded legacy policy.",
  inputs: [
    { id: "requiredLoci", label: "Required loci", kind: "stringList" },
    { id: "observedLoci", label: "Observed loci", kind: "stringList" },
  ],
  outputs: [
    { id: "missingLoci", label: "Missing loci", kind: "stringList" },
    { id: "complete", label: "Complete", kind: "boolean" },
    { id: "coveragePercent", label: "Coverage percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      requiredLoci: value.requiredLoci as readonly string[],
      observedLoci: value.observedLoci as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
