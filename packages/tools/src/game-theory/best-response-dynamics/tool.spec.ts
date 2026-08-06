import { describe, expect, it } from "vitest";
import {
  bestResponseDynamicsExample,
  runBestResponseDynamics,
} from "./tool.js";
describe("best-response dynamics", () => {
  it("publishes an executable example", () =>
    expect(runBestResponseDynamics(bestResponseDynamicsExample.input)).toEqual({
      ok: true,
      output: bestResponseDynamicsExample.output,
    }));
});
