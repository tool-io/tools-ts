import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const responsePolesZerosConsistencyCheckerExample = {
  input: { zeroCount: 2, poleCount: 5, normalizationFactor: 3948.58 },
  output: { consistent: true, issuesFound: [] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const responsePolesZerosConsistencyCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ zeroCount, poleCount, normalizationFactor }) => {
      const issuesFound: string[] = [];
      if (poleCount < zeroCount) issuesFound.push("more zeros than poles");
      if (normalizationFactor === 0)
        issuesFound.push("zero normalization factor");
      if (poleCount > 12 || zeroCount > 8)
        issuesFound.push("implausibly high order stage");
      return { consistent: issuesFound.length === 0, issuesFound };
    })(input as never) as Record<string, unknown>,
  description:
    "Validate an analog response stage: pole/zero counts and normalization sanity.",
  id: "seismology/response-poles-zeros-consistency-checker",
  inputs: [
    {
      minimum: 0,
      description: "Number of zeros.",
      id: "zeroCount",
      kind: "integer",
      label: "n_z",
    },
    {
      minimum: 0,
      description: "Number of poles.",
      id: "poleCount",
      kind: "integer",
      label: "n_p",
    },
    {
      minimum: 0,
      description: "Normalization constant.",
      id: "normalizationFactor",
      kind: "number",
      label: "A₀",
    },
  ],
  outputs: [
    {
      description: "Whether the stage definition is plausible.",
      id: "consistent",
      kind: "boolean",
      label: "Consistent?",
    },
    {
      description: "Names of failed checks.",
      id: "issuesFound",
      kind: "stringList",
      label: "Issues",
    },
  ],
  title: "Response Poles Zeros Consistency Checker",
});
export const runResponsePolesZerosConsistencyChecker =
  responsePolesZerosConsistencyCheckerTool.execute;
export { responsePolesZerosConsistencyCheckerExample as example };
export default responsePolesZerosConsistencyCheckerTool;
