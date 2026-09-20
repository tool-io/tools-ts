import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateDetailsDisclosureStateFixture,
  runDetailsDisclosureStateFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateDetailsDisclosureStateFixture, example);
    expect(runDetailsDisclosureStateFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, nodeCount: 17 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "nodeCount", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const { seed, ...input } = example.input;
    expect(tool.execute(input, { random: () => 0.9 })).toMatchObject({
      ok: true,
      output: {
        nodes: [
          { open: false, visible: true },
          { open: false, visible: false },
        ],
      },
    });
  });
});
