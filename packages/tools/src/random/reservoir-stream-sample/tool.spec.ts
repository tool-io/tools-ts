import { describe, expect, it } from "vitest";
import tool, {
  calculateReservoirStreamSample,
  reservoirStreamSampleExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateReservoirStreamSample, example);
  it("resumes seeded chunks exactly, including chunks after replacement has started", () => {
    for (const cut of [0, 1, 2, 3, 4]) {
      const first = calculateReservoirStreamSample({
        ...example.input,
        chunk: example.input.chunk.slice(0, cut),
      });
      if (!first.ok) throw new Error("Expected first chunk success");
      const before = JSON.stringify(first.output.state);
      const second = calculateReservoirStreamSample({
        capacity: 2,
        chunk: example.input.chunk.slice(cut),
        state: first.output.state,
      });
      if (!second.ok) throw new Error("Expected continuation success");
      expect(second.output.state).toEqual(example.output.state);
      expect([...first.output.updates, ...second.output.updates]).toEqual(
        example.output.updates,
      );
      expect(JSON.stringify(first.output.state)).toBe(before);
    }
  });
  it("independently enumerates all six equally likely Algorithm R paths for K1 of3", () => {
    const counts = new Map<string, number>();
    for (const firstDraw of [0, 0.5])
      for (const secondDraw of [0, 1 / 3, 2 / 3]) {
        const draws = [firstDraw, secondDraw];
        let index = 0;
        const result = calculateReservoirStreamSample(
          { capacity: 1, chunk: example.input.chunk.slice(0, 3) },
          { random: () => draws[index++] },
        );
        if (!result.ok) throw new Error("Expected success");
        const id = result.output.state.reservoir[0].record.id;
        counts.set(id, (counts.get(id) ?? 0) + 1);
        expect(result.output.inclusionProbability).toBe(1 / 3);
      }
    expect(counts).toEqual(
      new Map([
        ["C", 2],
        ["B", 2],
        ["A", 2],
      ]),
    );
  });
  it("continues an explicit advancing context source without reseeding it", () => {
    const values = [0.9, 0.1];
    let call = 0;
    const context = { random: () => values[call++] };
    const first = calculateReservoirStreamSample(
      { capacity: 2, chunk: example.input.chunk.slice(0, 3) },
      context,
    );
    if (!first.ok) throw new Error("Expected success");
    const second = calculateReservoirStreamSample(
      {
        capacity: 2,
        chunk: example.input.chunk.slice(3),
        state: first.output.state,
      },
      context,
    );
    expect(second).toMatchObject({
      ok: true,
      output: {
        state: { reservoir: [{ streamIndex: 3 }, { streamIndex: 1 }] },
      },
    });
    expect(call).toBe(2);
    expect(
      tool.execute({ capacity: 2, chunk: [], state: first.output.state }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "missing_continuation_source", field: "state" }],
      },
    });
  });
  it("supports partial-fill and zero-capacity states without unnecessary draws", () => {
    expect(
      calculateReservoirStreamSample(
        { capacity: 0, chunk: example.input.chunk },
        {
          random: () => {
            throw new Error("No draw needed");
          },
        },
      ),
    ).toMatchObject({
      ok: true,
      output: { state: { seen: 4, reservoir: [] }, inclusionProbability: 0 },
    });
    expect(tool.execute({ ...example.input, capacity: 8 })).toMatchObject({
      ok: true,
      output: {
        state: {
          reservoir: example.input.chunk.map((record, streamIndex) => ({
            record,
            streamIndex,
          })),
        },
        inclusionProbability: 1,
      },
    });
    expect(tool.execute({ capacity: 2, chunk: [] })).toMatchObject({
      ok: true,
      output: { inclusionProbability: 0, updates: [] },
    });
  });
  it("rejects inconsistent state, changed seed, source positions, and cumulative limits", () => {
    const state = example.output.state;
    expect(tool.execute({ capacity: 3, chunk: [], state })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "state", code: "invalid_reservoir_state" }] },
    });
    expect(
      tool.execute({ capacity: 2, chunk: [], state, seed: 43 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "state_seed_mismatch" }] },
    });
    expect(
      tool.execute({
        capacity: 2,
        chunk: [],
        state: {
          ...state,
          reservoir: [state.reservoir[0], state.reservoir[0]],
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_reservoir_state" }] },
    });
    expect(
      tool.execute({
        capacity: 2,
        chunk: [example.input.chunk[0]],
        state: { ...state, seen: 100000 },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "chunk", code: "resource_limit_exceeded" }] },
    });
  });
});
