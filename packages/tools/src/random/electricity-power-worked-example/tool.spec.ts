import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, sourceTool, type Input } from "./tool.js";
it("reports practice evidence budget failures without changing source-calculator results", () => {
  const input = { voltage: 1e10, current: 1e10 };
  expect(sourceTool.execute(input).ok).toBe(true);
  const result = calculate({
    ...example.input,
    candidatesJson: JSON.stringify([{ id: "large", input }]),
  }).result;
  expect(result.status).toBe("empty-eligible-bank");
  expect(result.rejected[0].error).toMatchObject({
    code: "invalid_input",
    issues: [{ code: "practice_evidence_budget_exceeded" }],
  });
});
const input = JSON.parse(example.input.candidatesJson)[0].input as Record<
  string,
  unknown
>;
const make = (ids: readonly string[]): Input => ({
  ...example.input,
  candidatesJson: JSON.stringify(ids.map((id) => ({ id, input }))),
});
describe(tool.id, () => {
  it("uses the actual imported calculator answer, not a copied formula", () => {
    const r = calculate(example.input),
      a = sourceTool.execute(input);
    expect(a.ok).toBe(true);
    expect(r.result.status).toBe("ok");
    if (a.ok) expect(r.result.exercises[0].answer).toEqual(a.output);
    expect(r.result.exercises[0].prompt).toEqual(input);
    expect(r.result.baseToolId).toBe(sourceTool.id);
  });
  it("publishes a valid contract and both schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(
      matchesToolJsonSchema(calculate(example.input), tool.outputSchema),
    ).toBe(true);
  });
  it("executes through the public definition", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output).toEqual(calculate(example.input));
  });
  it("preserves source model description, units and port definitions", () => {
    const r = calculate(example.input).result;
    expect(r.model.description).toBe(sourceTool.description);
    expect(r.model.inputs).toEqual(sourceTool.ports.inputs);
    expect(r.model.outputs).toEqual(sourceTool.ports.outputs);
  });
  it("replays an explicit seed without mutating evidence", () => {
    const x = { ...make(["a", "b", "c"]), count: 3 },
      before = JSON.stringify(x);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(before);
  });
  it("advances one caller source across all draws", () => {
    let draws = 0;
    const sequence = [0, 0.99, 0.5];
    const r = calculate(
      { ...make(["a", "b", "c"]), count: 3, withoutReplacement: false },
      { random: () => sequence[draws++] },
    );
    expect(draws).toBe(3);
    expect(r.result.exercises.map((v) => v.candidateId)).toEqual([
      "a",
      "c",
      "b",
    ]);
    expect(r.result.replay.source).toBe("injected");
  });
  it("retains distinct candidate IDs even when inputs and answers coincide", () => {
    const r = calculate(
      { ...make(["a", "b", "c"]), count: 3 },
      { random: () => 0 },
    );
    expect(r.result.exercises.map((v) => v.candidateId)).toEqual([
      "a",
      "b",
      "c",
    ]);
    expect(
      r.result.exercises.every(
        (v) =>
          JSON.stringify(v.answer) ===
          JSON.stringify(r.result.exercises[0].answer),
      ),
    ).toBe(true);
  });
  it("explicitly allows repeated candidate IDs across draws only with replacement", () => {
    const r = calculate(
      { ...make(["a", "b"]), count: 3, withoutReplacement: false },
      { random: () => 0 },
    );
    expect(r.result.exercises.map((v) => v.candidateId)).toEqual([
      "a",
      "a",
      "a",
    ]);
  });
  it("preserves structured errors for rejected candidates while drawing eligible IDs", () => {
    const bad = { ...input, unknownField: 1 };
    const x = {
      ...example.input,
      candidatesJson: JSON.stringify([
        { id: "bad", input: bad },
        { id: "valid", input },
      ]),
    };
    const r = calculate(x, { random: () => 0 }).result,
      expected = sourceTool.execute(bad);
    expect(expected.ok).toBe(false);
    expect(r.eligibleCandidateIds).toEqual(["valid"]);
    expect(r.rejected.length).toBe(1);
    if (!expected.ok) expect(r.rejected[0].error).toEqual(expected.error);
    expect(r.exercises[0].candidateId).toBe("valid");
  });
  it("reports an empty eligible bank and never falls back", () => {
    let draws = 0;
    const x = { ...example.input, candidatesJson: "[]" };
    const r = calculate(x, {
      random: () => {
        draws++;
        return 0;
      },
    }).result;
    expect(r.status).toBe("empty-eligible-bank");
    expect(r.exercises).toEqual([]);
    expect(draws).toBe(0);
  });
  it("reports all rejected evidence without consuming entropy", () => {
    let draws = 0;
    const r = calculate(
      {
        ...example.input,
        candidatesJson: JSON.stringify([
          { id: "bad", input: { ...input, unknownField: 1 } },
        ]),
      },
      {
        random: () => {
          draws++;
          return 0;
        },
      },
    ).result;
    expect(r.status).toBe("empty-eligible-bank");
    expect(r.rejected.length).toBe(1);
    expect(draws).toBe(0);
  });
  it("reports infeasible no-replacement requests without partial draws", () => {
    let draws = 0;
    const r = calculate(
      { ...make(["a", "b"]), count: 3 },
      {
        random: () => {
          draws++;
          return 0;
        },
      },
    ).result;
    expect(r.status).toBe("insufficient-eligible-bank");
    expect(r.exercises).toEqual([]);
    expect(draws).toBe(0);
  });
  it("rejects duplicate candidate identities and malformed bank records", () => {
    for (const candidatesJson of [
      JSON.stringify([
        { id: "x", input },
        { id: "x", input },
      ]),
      "[null]",
      "[{}]",
      JSON.stringify([{ id: "", input }]),
    ])
      expect(() => calculate({ ...example.input, candidatesJson })).toThrow();
  });
  it("rejects malformed nonfinite deep and oversize evidence", () => {
    for (const candidatesJson of [
      "{",
      "[1e999]",
      "[".repeat(18) + "0" + "]".repeat(18),
      "x".repeat(8193),
    ])
      expect(() => calculate({ ...example.input, candidatesJson })).toThrow();
  });
  it("requires explicit own fields and rejects extras", () => {
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
    expect(() => calculate({ ...example.input, extra: 1 } as Input)).toThrow();
    expect(tool.execute({})).toMatchObject({ ok: false });
  });
  it("bounds count to positive integers no greater than 32", () => {
    for (const count of [0, -1, 0.5, 33, NaN, Infinity])
      expect(() => calculate({ ...example.input, count })).toThrow();
  });
  it("rejects wrong field types and nulls", () => {
    for (const [k, v] of Object.entries(example.input))
      for (const bad of [null, typeof v === "string" ? 1 : "bad"])
        expect(tool.execute({ ...example.input, [k]: bad })).toMatchObject({
          ok: false,
        });
  });
  it("does not replace invalid entropy with ambient randomness", () => {
    for (const value of [NaN, Infinity, -1, 1])
      expect(() => calculate(example.input, { random: () => value })).toThrow();
  });
  it("honors cancellation before candidate evaluation and sampling", () => {
    let calls = 0;
    const r = tool.execute(example.input, {
      signal: { aborted: true },
      random: () => {
        calls++;
        return 0;
      },
    });
    expect(r.ok).toBe(false);
    expect(calls).toBe(0);
  });
});

// Batch 56 additional practice regressions
it("bounds candidate count, depth and identity without mutating valid entries", () => {
  for (const candidatesJson of [
    JSON.stringify(
      Array.from({ length: 129 }, (_, j) => ({ id: String(j), input })),
    ),
    JSON.stringify([{ id: "x", input: [] }]),
    JSON.stringify([{ id: "x", input, extra: 1 }]),
  ])
    expect(() => calculate({ ...example.input, candidatesJson })).toThrow();
});
it("requires a bounded nonblank seed regardless of entropy source", () => {
  for (const seed of ["", "   ", "x".repeat(257)])
    expect(() =>
      calculate({ ...example.input, seed }, { random: () => 0 }),
    ).toThrow();
});
it("preserves candidate source indexes after rejecting earlier evidence", () => {
  const r = calculate(
    {
      ...example.input,
      candidatesJson: JSON.stringify([
        { id: "bad", input: { ...input, unknownField: 1 } },
        { id: "x", input },
        { id: "y", input },
      ]),
      count: 2,
    },
    { random: () => 0 },
  ).result;
  expect(r.exercises.map((v) => v.sourceIndex)).toEqual([1, 2]);
  expect(r.replay.draws).toBe(2);
});
it("draws exact no-replacement support for every first-position quantile", () => {
  for (let j = 0; j < 4; j++) {
    const r = calculate(make(["a", "b", "c", "d"]), {
      random: () => (j + 0.5) / 4,
    }).result;
    expect(r.exercises[0].candidateId).toBe(["a", "b", "c", "d"][j]);
  }
});
it("does not consult ambient clocks or caller environment for practice selection", () => {
  const a = calculate(make(["a", "b"])),
    b = calculate(make(["a", "b"]), {
      now: () => 0,
      locale: "other",
      timeZone: "other",
    });
  expect(a).toEqual(b);
});
