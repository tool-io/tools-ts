import { describe, expect, it } from "vitest";
import { antColonyTspExample, runAntColonyTsp } from "./tool.js";
describe("ant colony TSP", () => {
  it("publishes an executable example", () =>
    expect(runAntColonyTsp(antColonyTspExample.input)).toEqual({
      ok: true,
      output: antColonyTspExample.output,
    }));
});
