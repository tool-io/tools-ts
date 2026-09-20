import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateLiveRegionMessageSequence,
  runLiveRegionMessageSequence,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateLiveRegionMessageSequence, example);
    expect(runLiveRegionMessageSequence(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, groupSize: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "groupSize", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({ ...example.input, count: 5, policy: "off" }),
    ).toMatchObject({
      ok: true,
      output: {
        groups: [["Queued", "Saved"], ["Queued", "Queued"], ["Saved"]],
        modeledAnnouncements: [],
      },
    });
    expect(tool.execute({ ...example.input, atomic: false })).toMatchObject({
      ok: true,
      output: { modeledAnnouncements: ["Queued", "Saved", "Queued"] },
    });
  });
});
