import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  classroomStationRotationExample as example,
  calculateClassroomStationRotation,
} from "./tool.js";

describe("Random Classroom Station Rotation Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateClassroomStationRotation(example.input)).toEqual({
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
  it("covers every supplied pair exactly once with no within-round collision", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const pairs = new Set<string>();
    for (const round of result.output.rounds) {
      expect(new Set(round.visits.map((v) => v.groupId)).size).toBe(3);
      expect(new Set(round.visits.map((v) => v.stationId)).size).toBe(3);
      round.visits.forEach((v) =>
        pairs.add(JSON.stringify([v.groupId, v.stationId])),
      );
      expect(round.startMinute).toBe(5 + (round.round - 1) * 10);
    }
    expect(pairs.size).toBe(9);
    expect(result.output.endMinute).toBe(35);
  });
  it("adapts delimiter-bearing IDs without corrupting group or station identity", () => {
    const result = tool.execute({
      groupIds: ["A,:B"],
      stationIds: ["S:1,2"],
      startMinute: -2,
      roundMinutes: 0.5,
      seed: 1,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        rounds: [
          {
            round: 1,
            startMinute: -2,
            visits: [{ groupId: "A,:B", stationId: "S:1,2" }],
          },
        ],
        endMinute: -1.5,
      },
    });
  });
  it("rejects incomplete rosters and nonrepresentable timing without arbitrary magnitude caps", () => {
    expect(
      tool.execute({ ...example.input, roundMinutes: Number.MAX_VALUE }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "time_overflow" }] },
    });
    expect(
      tool.execute({ ...example.input, startMinute: 1e30, roundMinutes: 1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "time_resolution" }] },
    });
    for (const change of [
      { stationIds: ["S"] },
      { groupIds: ["A", "A", "B"] },
      { roundMinutes: 0 },
      { startMinute: NaN },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
