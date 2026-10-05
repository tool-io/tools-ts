import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../core/contract.js";
import bmi from "../body-mass-index/tool.js";
import quadratic from "../algebra/quadratic-equation/tool.js";
import { corpus } from "./batch42-shared.js";
import { practice } from "./batch56-practice.js";
import { practice as boundedPractice } from "./batch57-practice.js";
import {
  boundedPracticeResultSchema,
  corpusResultSchema,
  practiceResultSchema,
} from "./exercise-schema.js";

describe("composed exercise contracts", () => {
  it("preserves raw candidates when imported tools supply defaults", () => {
    const corpusResult = corpus(quadratic, {
      seed: "defaults",
      count: 1,
      withoutReplacement: true,
      candidateInputsJson: ["{}"],
    }).result;
    expect(corpusResult.exercises[0]?.input).toEqual({});
    expect(matchesToolJsonSchema({}, quadratic.inputSchema)).toBe(true);
    expect(
      matchesToolJsonSchema(corpusResult, corpusResultSchema(quadratic)),
    ).toBe(true);
    const input = {
      seed: "defaults",
      count: 1,
      withoutReplacement: true,
      candidatesJson: '[{"id":"default","input":{}}]',
    };
    for (const result of [
      practice(quadratic, input).result,
      boundedPractice(quadratic, input).result,
    ]) {
      expect(result.exercises[0]?.prompt).toEqual({});
      const schema =
        "practiceLimits" in result
          ? boundedPracticeResultSchema(quadratic)
          : practiceResultSchema(quadratic);
      expect(matchesToolJsonSchema(result, schema)).toBe(true);
    }
  });
  it("validates the actual imported answer and rejects nested type regressions", () => {
    const result = corpus(bmi, {
      seed: "schema",
      count: 1,
      withoutReplacement: true,
      candidateInputsJson: ['{"heightM":2,"weightKg":80}'],
    }).result;
    const schema = corpusResultSchema(bmi);
    expect(matchesToolJsonSchema(result, schema)).toBe(true);
    expect(
      matchesToolJsonSchema(
        {
          ...result,
          exercises: [
            { input: { heightM: 2, weightKg: 80 }, answer: { bmi: "20" } },
          ],
        },
        schema,
      ),
    ).toBe(false);
    expect(
      matchesToolJsonSchema(
        { ...result, selectedCandidateIndices: [-1] },
        schema,
      ),
    ).toBe(false);
  });
  it("represents successful, rejected and empty practice banks", () => {
    const schema = practiceResultSchema(bmi);
    for (const candidates of [
      [],
      [{ id: "a", input: { heightM: 2, weightKg: 80 } }],
      [{ id: "a", input: { heightM: 0, weightKg: 80 } }],
    ]) {
      const result = practice(bmi, {
        seed: "schema",
        count: 1,
        withoutReplacement: true,
        candidatesJson: JSON.stringify(candidates),
      }).result;
      expect(matchesToolJsonSchema(result, schema)).toBe(true);
    }
  });
  it("requires bounded practice limits and validates each reported limit", () => {
    const schema = boundedPracticeResultSchema(bmi);
    const result = boundedPractice(bmi, {
      seed: "schema",
      count: 1,
      withoutReplacement: true,
      candidatesJson: '[{"id":"a","input":{"heightM":2,"weightKg":80}}]',
    }).result;
    expect(matchesToolJsonSchema(result, schema)).toBe(true);
    expect(
      matchesToolJsonSchema(
        { ...result, practiceLimits: { count: "unbounded" } },
        schema,
      ),
    ).toBe(false);
    const { practiceLimits: _limits, ...withoutLimits } = result;
    expect(matchesToolJsonSchema(withoutLimits, schema)).toBe(false);
  });
});
