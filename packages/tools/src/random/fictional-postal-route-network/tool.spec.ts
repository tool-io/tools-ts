import { expect, it } from "vitest";
import tool, {
  calculateFictionalPostalRouteNetwork,
  example,
} from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFictionalPostalRouteNetwork, example);
it("lightweight reserved-looking IDs remain own graph keys and terminal newlines fail", () => {
  expect(
    tool.execute({
      nodeIds: ["constructor", "toString"],
      depot: "constructor",
      candidates: [{ from: "constructor", to: "toString" }],
      edgeCount: 1,
      undeliverableCount: 0,
      seed: 42,
    }),
  ).toMatchObject({
    ok: true,
    output: {
      reachableFromDepot: ["constructor", "toString"],
      componentCount: 1,
    },
  });
  expect(
    tool.execute({ ...example.input, nodeIds: ["a\n", "b", "c"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "nodeIds", code: "invalid_field" }] },
  });
});
it("lightweight independent depot-only delivery supports every other node isolated", () => {
  expect(
    tool.execute({ ...example.input, undeliverableCount: 2, edgeCount: 0 }),
  ).toMatchObject({
    ok: true,
    output: {
      deliverableIds: ["a"],
      reachableFromDepot: ["a"],
      edges: [],
      componentCount: 3,
    },
  });
  expect(tool.execute({ ...example.input, depot: "missing" })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "unknown_reference", field: "depot" }] },
  });
});
