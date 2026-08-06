import { describe, expect, it } from "vitest";
import {
  generateNetworkFlowInstance,
  networkFlowInstanceExample,
  runNetworkFlowInstance,
} from "./tool.js";
describe("Network Flow Instance", () => {
  it("omits self-edges", () =>
    expect(
      generateNetworkFlowInstance(4, 1, 1, 2, "seed")?.edges.every(
        (edge) => edge.from !== edge.to,
      ),
    ).toBe(true));
  it("publishes an executable example", () =>
    expect(runNetworkFlowInstance(networkFlowInstanceExample.input)).toEqual({
      ok: true,
      output: networkFlowInstanceExample.output,
    }));
});
