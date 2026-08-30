import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const attackModes = [
  "invert",
  "stress",
  "remove",
  "delegate",
  "preempt",
  "reframe",
] as const;

export type AssumptionAttackInput = {
  readonly assumptions: ReadonlyArray<string>;
  readonly attackModes: ReadonlyArray<string>;
};

export type AssumptionAttackOutput = {
  readonly assumptionCount: number;
  readonly attackCount: number;
  readonly attackPrompts: ReadonlyArray<string>;
};

export const generateAssumptionAttackProtocol = (
  input: AssumptionAttackInput,
): AssumptionAttackOutput => {
  if (!Array.isArray(input.assumptions) || input.assumptions.length === 0)
    simpleError(
      "assumptions",
      "At least one assumption is required.",
      "assumptions_required",
    );
  const assumptions = input.assumptions.map((assumption, index) => {
    if (typeof assumption !== "string" || assumption.trim() === "")
      simpleError(
        `assumptions.${index}`,
        "Assumptions must be nonempty strings.",
        "invalid_assumption",
      );
    return assumption.trim();
  });
  if (!Array.isArray(input.attackModes) || input.attackModes.length === 0)
    simpleError(
      "attackModes",
      "At least one attack mode is required.",
      "attack_modes_required",
    );
  const normalizedAttackModes = input.attackModes.map((attackMode, index) => {
    if (
      typeof attackMode !== "string" ||
      !attackModes.includes(
        attackMode.trim().toLowerCase() as (typeof attackModes)[number],
      )
    )
      simpleError(
        `attackModes.${index}`,
        "Attack modes must be invert, stress, remove, delegate, preempt, or reframe.",
        "invalid_attack_mode",
      );
    return attackMode.trim().toLowerCase();
  });
  const attackPrompts = assumptions.flatMap((assumption) =>
    normalizedAttackModes.map(
      (attackMode) =>
        `${attackMode}: challenge '${assumption}' and record the evidence that would disprove it.`,
    ),
  );
  return {
    assumptionCount: assumptions.length,
    attackCount: attackPrompts.length,
    attackPrompts,
  };
};

export const assumptionAttackExample = {
  input: {
    assumptions: ["Customers will adopt", "Costs will fall"],
    attackModes: ["invert", "stress"],
  },
  output: {
    assumptionCount: 2,
    attackCount: 4,
    attackPrompts: [
      "invert: challenge 'Customers will adopt' and record the evidence that would disprove it.",
      "stress: challenge 'Customers will adopt' and record the evidence that would disprove it.",
      "invert: challenge 'Costs will fall' and record the evidence that would disprove it.",
      "stress: challenge 'Costs will fall' and record the evidence that would disprove it.",
    ],
  },
} satisfies ToolExample<AssumptionAttackInput, AssumptionAttackOutput>;

export const assumptionAttackTool = createSimpleTool({
  calculate: (input) =>
    generateAssumptionAttackProtocol({
      assumptions: input.assumptions as string[],
      attackModes: input.attackModes as string[],
    }),
  description:
    "Cross caller-supplied assumptions with red-team attack modes to generate falsifiable challenge prompts.",
  id: "futurology/red-team-devils-advocate-assumption-attack-protocol",
  inputs: [
    { id: "assumptions", kind: "stringList", label: "Assumptions" },
    {
      description:
        "Labels from invert, stress, remove, delegate, preempt, and reframe.",
      id: "attackModes",
      kind: "stringList",
      label: "Attack modes",
    },
  ],
  outputs: [
    {
      id: "assumptionCount",
      kind: "integer",
      label: "Assumptions",
      minimum: 1,
    },
    { id: "attackCount", kind: "integer", label: "Attack prompts", minimum: 1 },
    { id: "attackPrompts", kind: "stringList", label: "Attack prompts" },
  ],
  title: "Red Team Devils Advocate Assumption Attack Protocol",
});

export const runAssumptionAttack = assumptionAttackTool.execute;
export default assumptionAttackTool;
