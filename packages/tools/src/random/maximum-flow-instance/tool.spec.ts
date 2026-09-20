import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  maximumFlowInstanceExample as example,
  calculateMaximumFlowInstance,
} from "./tool.js";
const smallInput = {
  nodeCount: 2,
  arcCount: 1,
  minimumCapacity: 3,
  maximumCapacity: 3,
  seed: 42,
} as const;

describe("Random Maximum Flow Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMaximumFlowInstance(example.input)).toEqual({
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
  it("checks distinct arcs, path coverage, capacity and conservation using exact balances", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        nodeCount: 8,
        arcCount: 30,
        maximumCapacity: 20,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output,
        balances = Array<bigint>(8).fill(0n);
      expect(out.arcs).toHaveLength(30);
      expect(out.arcFlows).toHaveLength(30);
      expect(new Set(out.arcs.map((arc) => arc.from + "," + arc.to)).size).toBe(
        30,
      );
      expect([...out.witnessPath].sort((a, b) => a - b)).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7,
      ]);
      expect(out.witnessPath[0]).toBe(0);
      expect(out.witnessPath.at(-1)).toBe(7);
      out.arcs.forEach((arc, i) => {
        expect(arc.from).not.toBe(arc.to);
        expect(arc.capacity).toBeGreaterThanOrEqual(3);
        expect(arc.capacity).toBeLessThanOrEqual(20);
        expect(out.arcFlows[i]).toBeGreaterThanOrEqual(0);
        expect(out.arcFlows[i]).toBeLessThanOrEqual(arc.capacity);
        balances[arc.from] -= BigInt(out.arcFlows[i]);
        balances[arc.to] += BigInt(out.arcFlows[i]);
      });
      expect(balances).toEqual([
        -BigInt(out.flowValue),
        0n,
        0n,
        0n,
        0n,
        0n,
        0n,
        BigInt(out.flowValue),
      ]);
    }
  });
  it("checks dense and minimal networks and invalid bounds", () => {
    for (const arcCount of [4, 20]) {
      const result = tool.execute({ ...smallInput, nodeCount: 5, arcCount });
      if (!result.ok) throw new Error("Expected success");
      expect(result.output.arcs).toHaveLength(arcCount);
    }
    expect(
      tool.execute({ ...smallInput, nodeCount: 5, arcCount: 3 }),
    ).toMatchObject({ ok: false, error: { issues: [{ field: "arcCount" }] } });
    expect(tool.execute({ ...smallInput, arcCount: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "arcCount" }] },
    });
    expect(tool.execute({ ...smallInput, minimumCapacity: 4 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumCapacity" }] },
    });
  });
});
