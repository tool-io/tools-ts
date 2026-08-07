import { describe, expect, it } from "vitest";
import { dataStorageCostExample, runDataStorageCost } from "./tool.js";
describe("data storage cost", () => {
  it("publishes an executable example", () =>
    expect(runDataStorageCost(dataStorageCostExample.input)).toEqual({
      ok: true,
      output: dataStorageCostExample.output,
    }));
});
