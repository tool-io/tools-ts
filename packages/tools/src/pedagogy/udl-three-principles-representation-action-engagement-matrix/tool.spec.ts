import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as bloom,
  example as bloomExample,
} from "../bloom-taxonomy-verb-wheel-level-classifier/tool.js";
import {
  calculate as stages,
  example as stageExample,
} from "../five-e-model-engage-explore-explain-elaborate-evaluate/tool.js";
import {
  calculate as curve,
  example as curveExample,
} from "../curve-grading-bell-adjustment-policy-lookup/tool.js";
import {
  calculate as coverage,
  example as coverageExample,
} from "../pacing-guide-coverage-versus-mastery-tension-lookup/tool.js";
import { calculate as assessment } from "../formative-vs-summative-purpose-classifier/tool.js";
import {
  calculate as ticket,
  example as ticketExample,
} from "../exit-ticket-three-question-template/tool.js";
import {
  calculate as bank,
  example as bankExample,
} from "../essential-questions-open-ended-transfer-goal-bank/tool.js";
import {
  calculate as effects,
  example as effectsExample,
} from "../hattie-visible-learning-top-effect-sizes-bar-lookup/tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("retains unknown UDL implementation separately from supported principle categories", () => {
    const r = calculate(example.input);
    expect(r.knownImplementedCountsByPrinciple).toEqual([1, 0, 1]);
    expect(r.unverifiedSupportIds).toEqual(["b"]);
  });
  it("does not force a single Bloom level from an ambiguous instruction verb", () => {
    expect(bloom(bloomExample.input).compatibleCallerBloomLevels).toEqual([
      "understand",
      "analyze",
    ]);
  });
  it("reports absent Bloom reference evidence without guessing an instructional demand", () => {
    expect(
      bloom({ ...bloomExample.input, observedInstructionVerb: "invented" })
        .compatibleCallerBloomLevels,
    ).toEqual([]);
  });
  it("reports observed Five-E order inversions without inventing learner failure", () => {
    const r = stages({
      ...stageExample.input,
      callerObservedFiveEStageIds: ["explain", "engage"],
    });
    expect(r.orderInversionIndices).toEqual([1]);
  });
  it("refuses duplicate or undeclared observed instructional stages", () => {
    expect(() =>
      stages({
        ...stageExample.input,
        callerObservedFiveEStageIds: ["engage", "engage"],
      }),
    ).toThrow();
    expect(() =>
      stages({
        ...stageExample.input,
        callerObservedFiveEStageIds: ["invented"],
      }),
    ).toThrow();
  });
  it("preserves an unclipped affine grade transformation, not a manufactured bell distribution", () => {
    const r = curve({ ...curveExample.input, callerTargetMean: 200 });
    expect(r.callerAffineAdjustedScores.every((v) => v > 100)).toBe(true);
  });
  it("does not treat covered but unknown mastery as known failure", () => {
    const r = coverage(coverageExample.input);
    expect(r.coveredButKnownUnmasteredIds).toEqual([]);
    expect(r.coveredButUnknownMasteryIds).toEqual(["b"]);
  });
  it("classifies formative versus summative by declared use rather than assessment format", () => {
    expect(assessment({ primaryAssessmentUse: "both" }).meaning).toContain(
      "same evidence",
    );
  });
  it("generates explicit ticket prompts without inventing an answer", () => {
    const r = ticket({
      ...ticketExample.input,
      callerLessonConcept: 'a literal "quoted" concept',
    });
    expect(r.exitTicketQuestions).toHaveLength(3);
    expect(r.exitTicketQuestions[0]).toContain('"quoted"');
  });
  it("does not invent essential questions for a missing bank topic", () => {
    expect(() =>
      bank({ ...bankExample.input, queryTopicId: "unknown" }),
    ).toThrow();
  });
  it("retains comparison-matched instructional-effect competition ties", () => {
    expect(
      effects(effectsExample.input).callerDescendingCompetitionRanks,
    ).toEqual([3, 1, 1]);
  });
  it("computes independent canonical values", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects wrong types and nonfinite evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and preserves evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("bounds evidence and refuses inherited sparse slots", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (Array.isArray(v)) {
        const invalid =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: invalid })).toMatchObject({
          ok: false,
        });
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
      }
    }
  });
  it("rejects invalid domains", () => {
    const input = {
      ...example.input,
      callerAnnotatedUdlPrinciples: [
        "unknown",
        "action-expression",
        "engagement",
      ],
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      knownSupportImplementationFlags: [0, 0, 0],
    };
    close(calculate(input), {
      knownImplementedCountsByPrinciple: [0, 0, 0],
      unverifiedSupportIds: ["a", "b", "c"],
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        knownImplementedCountsByPrinciple: [0, 0, 0],
        unverifiedSupportIds: ["a", "b", "c"],
      });
  });
});
