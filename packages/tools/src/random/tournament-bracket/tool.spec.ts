import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  tournamentBracketExample as example,
  calculateTournamentBracket,
} from "./tool.js";

describe("Random Single-Elimination Tournament Bracket Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateTournamentBracket(example.input)).toEqual({
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
  it("covers each participant and connects every preceding winner once for sizes 2–64", () => {
    for (let count = 2; count <= 64; count += 1) {
      const participants = Array.from({ length: count }, (_, i) => "p" + i),
        result = tool.execute({ participants, seed: 42 });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output,
        slots = out.rounds[0].matches.flatMap((match) => [
          match.left,
          match.right,
        ]);
      expect(
        slots
          .filter((slot) => slot.kind === "participant")
          .map((slot) =>
            slot.kind === "participant" ? slot.participantId : "",
          )
          .sort(),
      ).toEqual([...participants].sort());
      expect(slots.filter((slot) => slot.kind === "bye")).toHaveLength(
        out.byeCount,
      );
      expect(out.competitiveGameCount).toBe(count - 1);
      expect(out.rounds.at(-1)?.matches).toHaveLength(1);
      out.rounds[0].matches.forEach((match) => {
        expect(match.left.kind).toBe("participant");
        expect(match.right.kind).not.toBe("winner");
        expect(match.automaticWinner !== null).toBe(match.right.kind === "bye");
      });
      for (let i = 1; i < out.rounds.length; i += 1) {
        const references = out.rounds[i].matches
          .flatMap((match) => [match.left, match.right])
          .map((slot) => (slot.kind === "winner" ? slot.matchId : ""));
        expect(references.sort()).toEqual(
          out.rounds[i - 1].matches.map((match) => match.id).sort(),
        );
      }
      const all = out.rounds.flatMap((round) => round.matches);
      expect(new Set(all.map((match) => match.id)).size).toBe(
        out.slotCount - 1,
      );
      expect(
        all.filter((match) => match.automaticWinner === null),
      ).toHaveLength(count - 1);
    }
  });
  it("uses exact small counts and explicit large-count overflow metadata", () => {
    const small = tool.execute({ participants: ["A", "B", "C"], seed: 42 });
    if (!small.ok) throw new Error("Expected success");
    expect(small.output.participantOrderCount).toEqual({
      value: 6,
      status: "exact-safe-integer",
    });
    const large = tool.execute({
      participants: Array.from({ length: 32 }, (_, i) => String(i)),
      seed: 42,
    });
    if (!large.ok) throw new Error("Expected success");
    expect(large.output.participantOrderCount).toEqual({
      value: null,
      status: "exceeds-core-safe-integer",
    });
    expect(tool.execute({ participants: ["A", "A"], seed: 42 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "participants", code: "invalid_participant_ids" }],
      },
    });
  });
});
