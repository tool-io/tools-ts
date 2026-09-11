import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, inventory } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualScenarioIds: readonly string[];
  readonly callerVerifiedScenarioDosePerKg: readonly number[];
  readonly scenarioEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualScenarioIds", label: "Actual scenario ids", kind: "stringList" },
  {
    id: "callerVerifiedScenarioDosePerKg",
    label: "Caller verified scenario dose per kg",
    kind: "numberList",
  },
  {
    id: "scenarioEvidenceKnownFlags",
    label: "Scenario evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const result = inventory(
    input.actualScenarioIds,
    input.callerVerifiedScenarioDosePerKg,
    input.scenarioEvidenceKnownFlags,
  );
  return {
    knownTotal: result.knownTotal,
    knownIds: result.knownIds,
    unknownIds: result.unknownIds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualScenarioIds: ["route-a", "route-b"],
    callerVerifiedScenarioDosePerKg: [2, 3],
    scenarioEvidenceKnownFlags: [1, 0],
  },
  output: {
    result: { knownTotal: 2, knownIds: ["route-a"], unknownIds: ["route-b"] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/exposure-assessment",
  title: "Exposure Assessment Model Calculator",
  description:
    "Actual independently reviewed compatible exposure-scenario ledger, unknown scenarios retained. Route absorption, overlap, dose convention and kinetics independently resolved; not full PBPK, automatic external-to-internal exposure model or safe dose.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
