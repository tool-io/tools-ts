import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateBitsetMembershipOperationTrace,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Exact bitset snapshots", () => {
  lightweightModelTests(tool, calculateBitsetMembershipOperationTrace, example);
  it("lightweight independently retains unsigned bit31 and bit63 words", () => {
    const result = tool.execute(
      {
        universeSize: 64,
        wordWidth: 32,
        initialMembers: [31, 63],
        operations: ["test"],
        eventCount: 1,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected unsigned bitset");
    expect(result.output.finalWords).toEqual([2147483648, 2147483648]);
    expect(result.output.finalMembers).toEqual([31, 63]);
    expect(result.output.events[0]).toMatchObject({
      index: 0,
      wasMember: false,
      isMember: false,
    });
  });
  it("lightweight rejects duplicate and out-of-universe initial members", () => {
    expect(
      tool.execute({ ...example.input, initialMembers: [1, 1] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "initialMembers", code: "duplicate_entries" }],
      },
    });
    expect(
      tool.execute({ ...example.input, initialMembers: [10] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "initialMembers", code: "member_range" }] },
    });
  });
});
