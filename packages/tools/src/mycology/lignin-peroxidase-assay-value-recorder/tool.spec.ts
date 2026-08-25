import { describe, expect, it } from "vitest";
import {
  ligninPeroxidaseAssayValueRecorderExample,
  runLigninPeroxidaseAssayValueRecorder,
} from "./tool.js";

describe("LiP Assay Recorder", () => {
  it("matches the canonical example", () =>
    expect(
      runLigninPeroxidaseAssayValueRecorder(
        ligninPeroxidaseAssayValueRecorderExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ligninPeroxidaseAssayValueRecorderExample.output,
    }));
  it("records zero activity", () =>
    expect(
      runLigninPeroxidaseAssayValueRecorder({ activityUnitsPerL: 0 }),
    ).toEqual({
      ok: true,
      output: { lipActivityUperL: 0 },
    }));
  it("records fractional activity", () =>
    expect(
      runLigninPeroxidaseAssayValueRecorder({ activityUnitsPerL: 0.99 }),
    ).toEqual({ ok: true, output: { lipActivityUperL: 0.99 } }));
  it("records exactly one unit", () =>
    expect(
      runLigninPeroxidaseAssayValueRecorder({ activityUnitsPerL: 1 }),
    ).toEqual({
      ok: true,
      output: { lipActivityUperL: 1 },
    }));
  it("records ten units", () =>
    expect(
      runLigninPeroxidaseAssayValueRecorder({ activityUnitsPerL: 10 }),
    ).toEqual({ ok: true, output: { lipActivityUperL: 10 } }));
  it("records values above ten without inventing a grade", () =>
    expect(
      runLigninPeroxidaseAssayValueRecorder({ activityUnitsPerL: 10.1 }),
    ).toEqual({ ok: true, output: { lipActivityUperL: 10.1 } }));
  it("records high numeric activity unchanged", () =>
    expect(
      runLigninPeroxidaseAssayValueRecorder({ activityUnitsPerL: 120 }),
    ).toEqual({ ok: true, output: { lipActivityUperL: 120 } }));
  it("rejects negative activity", () =>
    expect(
      runLigninPeroxidaseAssayValueRecorder({ activityUnitsPerL: -1 }).ok,
    ).toBe(false));
});
