import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  ipv4CidrBlockSetExample as example,
  calculateIpv4CidrBlockSet,
} from "./tool.js";

describe("Random IPv4 CIDR Block Set Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateIpv4CidrBlockSet(example.input)).toEqual({
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
  it("exhausts the four known /26 blocks without overlap or omission", () => {
    const result = tool.execute({ ...example.input, count: 4 });
    if (!result.ok) throw new Error("Expected success");
    const blocks = [...result.output.blocks].sort((a, b) => a.index - b.index);
    expect(blocks.map((block) => block.networkAddress)).toEqual([
      "192.0.2.0",
      "192.0.2.64",
      "192.0.2.128",
      "192.0.2.192",
    ]);
    expect(blocks.map((block) => block.broadcastAddress)).toEqual([
      "192.0.2.63",
      "192.0.2.127",
      "192.0.2.191",
      "192.0.2.255",
    ]);
    expect(blocks.every((block) => block.addressCount === 64)).toBe(true);
  });
  it("covers /0 and /32 safely without enumerating the IPv4 address space", () => {
    const all = tool.execute({
      parentAddress: "10.2.3.4",
      parentPrefix: 0,
      childPrefix: 0,
      count: 1,
      nonOverlap: true,
      seed: 42,
    });
    if (!all.ok) throw new Error("Expected success");
    expect(all.output.blocks[0]).toEqual({
      index: 0,
      cidr: "0.0.0.0/0",
      networkAddress: "0.0.0.0",
      broadcastAddress: "255.255.255.255",
      addressCount: 4294967296,
    });
    const hosts = tool.execute({
      parentAddress: "0.0.0.0",
      parentPrefix: 0,
      childPrefix: 32,
      count: 5,
      nonOverlap: true,
      seed: 42,
    });
    if (!hosts.ok) throw new Error("Expected success");
    expect(hosts.output.availableBlockCount).toBe(4294967296);
    expect(new Set(hosts.output.blocks.map((block) => block.index)).size).toBe(
      5,
    );
    for (const block of hosts.output.blocks) {
      expect(block.addressCount).toBe(1);
      expect(block.networkAddress).toBe(block.broadcastAddress);
    }
  });
  it("states replacement policy and rejects impossible or malformed parents", () => {
    const repeated = tool.execute({
      ...example.input,
      parentPrefix: 24,
      childPrefix: 24,
      count: 3,
      nonOverlap: false,
    });
    if (!repeated.ok) throw new Error("Expected success");
    expect(repeated.output.blocks.map((block) => block.cidr)).toEqual([
      "192.0.2.0/24",
      "192.0.2.0/24",
      "192.0.2.0/24",
    ]);
    expect(tool.execute({ ...example.input, count: 5 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "count", code: "insufficient_child_blocks" }],
      },
    });
    expect(tool.execute({ ...example.input, childPrefix: 23 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "childPrefix", code: "child_outside_parent" }],
      },
    });
    expect(
      tool.execute({ ...example.input, parentAddress: "192.0.2.999" }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "parentAddress", code: "invalid_parent_cidr" }],
      },
    });
    expect(
      tool.execute({ ...example.input, parentAddress: "1.1.1.1\n" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "parentAddress" }] },
    });
  });
});
