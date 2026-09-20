import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  cuckooHashTraceExample as example,
  calculateCuckooHashTrace,
} from "./tool.js";

describe("Two-Table Cuckoo Hashing Trace Tool", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCuckooHashTrace(example.input)).toEqual({
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
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
  });
  it("rolls back a bounded insertion failure without losing earlier keys", () => {
    const result = tool.execute({
      tableSize: 1,
      maximumKicks: 4,
      operations: [
        { operation: "insert", key: 10 },
        { operation: "insert", key: 20 },
        { operation: "insert", key: 30 },
        { operation: "lookup", key: 10 },
        { operation: "lookup", key: 20 },
        { operation: "lookup", key: 30 },
        { operation: "insert", key: 10 },
      ],
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.tables).toEqual({ first: [20], second: [10] });
    expect(result.output.trace.map((step) => step.outcome)).toEqual([
      "inserted",
      "inserted",
      "rehash-needed",
      "present",
      "present",
      "absent",
      "already-present",
    ]);
    expect(result.output.trace[2].moves).toHaveLength(4);
    expect(result.output.size).toBe(2);
  });
  it("maintains exact key placement and membership under a mixed workload", () => {
    const operations = Array.from({ length: 50 }, (_, key) => ({
      operation: "insert" as const,
      key,
    })).concat([]);
    const result = tool.execute({
      tableSize: 17,
      maximumKicks: 50,
      operations,
    });
    if (!result.ok) throw new Error("Expected success");
    const expected = new Set<number>();
    for (const step of result.output.trace)
      if (step.outcome === "inserted") expected.add(step.key);
    const stored = [
      ...result.output.tables.first,
      ...result.output.tables.second,
    ].filter((key): key is number => key !== null);
    expect(new Set(stored)).toEqual(expected);
    expect(stored.length).toBe(expected.size);
    result.output.tables.first.forEach((key, slot) => {
      if (key !== null) expect(key % 17).toBe(slot);
    });
    result.output.tables.second.forEach((key, slot) => {
      if (key !== null) expect(Math.floor(key / 17) % 17).toBe(slot);
    });
    const max = tool.execute({
      tableSize: 3,
      maximumKicks: 10,
      operations: [
        { operation: "insert", key: Number.MAX_SAFE_INTEGER },
        { operation: "lookup", key: Number.MAX_SAFE_INTEGER },
      ],
    });
    if (!max.ok) throw new Error("Expected success");
    expect(max.output.trace[1].outcome).toBe("present");
  });
  it("rejects malformed operations and bounds without silently dropping them", () => {
    expect(
      tool.execute({
        ...example.input,
        operations: [{ operation: "insert", key: -1 }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "operations" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        operations: [{ operation: "resize", key: 1 }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "operations" }] },
    });
    expect(tool.execute({ ...example.input, maximumKicks: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumKicks" }] },
    });
  });
});
