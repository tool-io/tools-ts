import { describe, expect, it } from "vitest";
import {
  generateOpenShopInstance,
  openShopInstanceExample,
  runOpenShopInstance,
} from "./tool.js";
describe("Open-Shop Scheduling Instance", () => {
  it("creates one machine time per job", () =>
    expect(
      generateOpenShopInstance(4, 3, 1, 20, "seed")?.map((row) => row.length),
    ).toEqual([3, 3, 3, 3]));
  it("publishes an executable example", () =>
    expect(runOpenShopInstance(openShopInstanceExample.input)).toEqual({
      ok: true,
      output: openShopInstanceExample.output,
    }));
});
