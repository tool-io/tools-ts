import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCoinChangeCombinationChallenge,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Coin change exact counts", () => {
  lightweightModelTests(tool, calculateCoinChangeCombinationChallenge, example);
  it("lightweight independently distinguishes the empty combination and an impossible odd amount", () => {
    expect(
      tool.execute({
        denominations: [2],
        minimumTarget: 0,
        maximumTarget: 0,
        count: 1,
        control: "reachable",
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            target: 0,
            reachable: true,
            combinationCount: "1",
            minimumCoins: 0,
            witness: [],
            quotientBounds: [0],
          },
        ],
      },
    });
    expect(
      tool.execute({
        denominations: [2],
        minimumTarget: 5,
        maximumTarget: 5,
        count: 1,
        control: "impossible",
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            target: 5,
            reachable: false,
            combinationCount: "0",
            minimumCoins: null,
            witness: [],
            quotientBounds: [2],
          },
        ],
      },
    });
  });
  it("lightweight reports a proved empty control class and rejects repeated denominations", () => {
    expect(
      tool.execute({
        ...example.input,
        denominations: [1],
        control: "impossible",
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "control", code: "no_target_in_range" }] },
    });
    expect(
      tool.execute({ ...example.input, denominations: [2, 2] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "denominations", code: "duplicate_entries" }],
      },
    });
  });
});
