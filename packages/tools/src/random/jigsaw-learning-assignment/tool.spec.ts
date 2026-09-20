import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  jigsawLearningAssignmentExample as example,
  calculateJigsawLearningAssignment,
} from "./tool.js";

describe("Random Jigsaw Learning Assignment Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateJigsawLearningAssignment(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("places each learner in one home and one expert group with every topic represented at home", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.homeGroups.flat().slice().sort()).toEqual(
      [...example.input.studentIds].sort(),
    );
    expect(
      result.output.expertGroups.flatMap((group) => group.studentIds).sort(),
    ).toEqual([...example.input.studentIds].sort());
    for (const home of result.output.homeGroups) {
      const topics = home.map((id) => {
        const group = result.output.expertGroups.find((candidate) =>
          candidate.studentIds.includes(id),
        );
        if (!group) throw new Error("Each learner needs an expert group.");
        return group.topicId;
      });
      expect(topics.slice().sort()).toEqual([...example.input.topicIds].sort());
    }
    expect(result.output.expertGroups.map((group) => group.topicId)).toEqual(
      result.output.topicOrder,
    );
  });
  it("handles single-topic and single-home layouts", () => {
    expect(
      tool.execute({ studentIds: ["A", "B"], topicIds: ["T"], seed: 42 }),
    ).toMatchObject({
      ok: true,
      output: {
        homeGroups: expect.arrayContaining([["A"], ["B"]]),
        expertGroups: [
          { topicId: "T", studentIds: expect.arrayContaining(["A", "B"]) },
        ],
      },
    });
    const result = tool.execute({
      studentIds: ["A", "B"],
      topicIds: ["T1", "T2"],
      seed: 42,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.expertGroups.every(
          (group) => group.studentIds.length === 1,
        ),
      ).toBe(true);
  });
  it("rejects incomplete groups, duplicate IDs and ambiguous serialized learner IDs", () => {
    for (const change of [
      { studentIds: ["A", "B"] },
      { studentIds: ["A,B", "C", "D"] },
      { topicIds: ["T", "T"] },
      { topicIds: [] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
