import { expect, it } from "vitest";
import tool, {
  calculateAssociationRuleThresholdExercise,
  associationRuleThresholdExerciseExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(
  tool,
  calculateAssociationRuleThresholdExercise,
  example,
);
it("handles zero cooccurrence with positive anchored marginals", () => {
  const result = calculateAssociationRuleThresholdExercise({
    ...example.input,
    transactionCount: 2,
  });
  if (!result.ok) throw new Error("expected anchor-only exercise");
  expect(result.output.answer).toEqual({
    metrics: {
      countA: 1,
      countB: 1,
      jointCount: 0,
      support: 0,
      confidence: 0,
      lift: 0,
    },
    coreRule: null,
    meetsSupport: false,
    meetsConfidence: false,
    meetsLift: false,
    accepted: false,
  });
});
it("answers all selected thresholds using independent transaction counts", () => {
  const result = calculateAssociationRuleThresholdExercise({
    ...example.input,
    transactionCount: 32,
    seed: 9,
  });
  if (!result.ok) throw new Error("expected exercise");
  const { transactions: rows, rule, thresholds, answer } = result.output;
  const a = rows.filter((row) => row.includes(rule.antecedent)).length,
    b = rows.filter((row) => row.includes(rule.consequent)).length,
    joint = rows.filter(
      (row) => row.includes(rule.antecedent) && row.includes(rule.consequent),
    ).length;
  expect(answer.metrics).toEqual({
    countA: a,
    countB: b,
    jointCount: joint,
    support: joint / rows.length,
    confidence: joint / a,
    lift: joint / a / (b / rows.length),
  });
  expect(answer.accepted).toBe(
    joint >= Math.ceil(thresholds.support * rows.length) &&
      joint / a >= thresholds.confidence &&
      joint / a / (b / rows.length) >= thresholds.lift,
  );
});
it("rejects impossible anchor counts, duplicate names and empty threshold banks", () => {
  expect(
    tool.execute({
      ...example.input,
      items: ["a", "b", "c"],
      transactionCount: 2,
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [
        { code: "insufficient_anchor_baskets", field: "transactionCount" },
      ],
    },
  });
  expect(tool.execute({ ...example.input, items: ["a", "a"] })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_items" }] },
  });
  expect(tool.execute({ ...example.input, supportChoices: [] })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "supportChoices" }] },
  });
});
