import { expect, it } from "vitest";
import tool, { calculateFantasyTemplePilgrimageMap, example } from "./index.js";
import { worldLightweightSpecs } from "../m500b-world-testing.js";
worldLightweightSpecs(tool, calculateFantasyTemplePilgrimageMap, example);
it("lightweight independent mandatory prerequisite cycle is explicit", () => {
  expect(
    tool.execute({
      ...example.input,
      prerequisites: [
        { from: "a", to: "b" },
        { from: "b", to: "a" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "cyclic_graph", field: "graph" }] },
  });
});
