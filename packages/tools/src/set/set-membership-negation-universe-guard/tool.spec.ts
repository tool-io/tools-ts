import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("set/set-membership-negation-universe-guard", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("matches its canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independently specified boundary or alternate case", () => {
    expect(
      tool.execute({ element: "a", members: ["a"], universe: ["a", "b"] }),
    ).toEqual({ ok: true, output: { member: true, complement: false } });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    { ...example.input, element: null },
  ])("rejects malformed input %j", (input) => {
    const result = tool.execute(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});

it("rejects accessor fields without invoking them", () => {
  let reads = 0;
  const input = { ...example.input };
  Object.defineProperty(input, "element", {
    enumerable: true,
    get() {
      reads++;
      throw new Error("Must not run");
    },
  });
  expect(tool.execute(input).ok).toBe(false);
  expect(reads).toBe(0);
});

it("rejects sparse, cyclic, and oversized lists", () => {
  const sparse = new Array<string>(2);
  sparse[1] = "a";
  const cyclic: unknown[] = [];
  cyclic.push(cyclic);
  for (const members of [
    sparse,
    cyclic,
    Array.from({ length: 257 }, () => "a"),
  ])
    expect(tool.execute({ ...example.input, members }).ok).toBe(false);
});

it("rejects explicit invalid domain and token boundary cases", () => {
  for (const change of [{ element: "outside" }]) {
    const result = tool.execute({ ...example.input, ...change });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues[0].code).toMatch(
        /invalid_|result_out_of_range/,
      );
    }
  }
});
