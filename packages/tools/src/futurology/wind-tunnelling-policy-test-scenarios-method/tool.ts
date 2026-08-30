import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindTunnellingInput = {
  readonly policyGoal: string;
  readonly policyMechanisms: ReadonlyArray<string>;
  readonly stressors: ReadonlyArray<string>;
};

export type WindTunnellingOutput = {
  readonly testCases: ReadonlyArray<string>;
  readonly testCount: number;
  readonly testSequence: ReadonlyArray<number>;
};

export const generateWindTunnellingTests = (
  input: WindTunnellingInput,
): WindTunnellingOutput => {
  if (typeof input.policyGoal !== "string" || input.policyGoal.trim() === "")
    simpleError(
      "policyGoal",
      "Policy goal must be a nonempty string.",
      "policy_goal_required",
    );
  if (
    !Array.isArray(input.policyMechanisms) ||
    input.policyMechanisms.length === 0
  )
    simpleError(
      "policyMechanisms",
      "At least one policy mechanism is required.",
      "policy_mechanisms_required",
    );
  if (!Array.isArray(input.stressors) || input.stressors.length === 0)
    simpleError(
      "stressors",
      "At least one stressor is required.",
      "stressors_required",
    );
  const mechanisms = input.policyMechanisms.map((mechanism, index) => {
    if (typeof mechanism !== "string" || mechanism.trim() === "")
      simpleError(
        `policyMechanisms.${index}`,
        "Policy mechanisms must be nonempty strings.",
        "invalid_policy_mechanism",
      );
    return mechanism.trim();
  });
  const stressors = input.stressors.map((stressor, index) => {
    if (typeof stressor !== "string" || stressor.trim() === "")
      simpleError(
        `stressors.${index}`,
        "Stressors must be nonempty strings.",
        "invalid_stressor",
      );
    return stressor.trim();
  });
  const testCases = stressors.flatMap((stressor) =>
    mechanisms.map(
      (mechanism) =>
        `Test ${mechanism} against ${stressor}: can it still advance ${input.policyGoal.trim()}?`,
    ),
  );
  return {
    testCases,
    testCount: testCases.length,
    testSequence: testCases.map((_, index) => index + 1),
  };
};

export const windTunnellingExample = {
  input: {
    policyGoal: "reliable low-carbon power",
    policyMechanisms: ["Performance standard", "Capacity support"],
    stressors: ["Demand surge", "Supply disruption"],
  },
  output: {
    testCases: [
      "Test Performance standard against Demand surge: can it still advance reliable low-carbon power?",
      "Test Capacity support against Demand surge: can it still advance reliable low-carbon power?",
      "Test Performance standard against Supply disruption: can it still advance reliable low-carbon power?",
      "Test Capacity support against Supply disruption: can it still advance reliable low-carbon power?",
    ],
    testCount: 4,
    testSequence: [1, 2, 3, 4],
  },
} satisfies ToolExample<WindTunnellingInput, WindTunnellingOutput>;

export const windTunnellingTool = createSimpleTool({
  calculate: (input) =>
    generateWindTunnellingTests({
      policyGoal: input.policyGoal as string,
      policyMechanisms: input.policyMechanisms as string[],
      stressors: input.stressors as string[],
    }),
  description:
    "Cross every caller-supplied policy mechanism with every stressor to generate wind-tunnelling tests for a policy goal.",
  id: "futurology/wind-tunnelling-policy-test-scenarios-method",
  inputs: [
    { id: "policyGoal", kind: "string", label: "Policy goal" },
    { id: "policyMechanisms", kind: "stringList", label: "Policy mechanisms" },
    { id: "stressors", kind: "stringList", label: "Stressors" },
  ],
  outputs: [
    { id: "testCases", kind: "stringList", label: "Policy stress tests" },
    { id: "testCount", kind: "integer", label: "Test count", minimum: 1 },
    { id: "testSequence", kind: "numberList", label: "Test sequence" },
  ],
  title: "Wind Tunnelling Policy Test Scenarios Method",
});

export const runWindTunnelling = windTunnellingTool.execute;
export default windTunnellingTool;
