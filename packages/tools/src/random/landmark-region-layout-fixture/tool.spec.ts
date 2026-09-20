import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateLandmarkRegionLayoutFixture,
  runLandmarkRegionLayoutFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateLandmarkRegionLayoutFixture, example);
    expect(runLandmarkRegionLayoutFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({ ...example.input, regions: [{ tag: "nav", label: "" }] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "regions", code: "missing_label_control" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({ ...example.input, duplicateLabel: false }),
    ).toMatchObject({ ok: true, output: { duplicateLabelIds: [] } });
    expect(
      tool.execute({
        regions: [{ tag: "nav", label: "A&B" }],
        duplicateLabel: false,
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        regions: [
          {
            parsed: { attributes: [{ name: "aria-label", value: "A&amp;B" }] },
          },
        ],
      },
    });
  });
});
