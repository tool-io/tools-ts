import { describe, expect, it } from "vitest";
import {
  chitinContentAssayRecorderExample,
  runChitinContentAssayRecorder,
} from "./tool.js";

describe("Chitin Assay Recorder", () => {
  it("matches the canonical example", () =>
    expect(
      runChitinContentAssayRecorder(chitinContentAssayRecorderExample.input),
    ).toEqual({
      ok: true,
      output: chitinContentAssayRecorderExample.output,
    }));
  it("records zero percent", () =>
    expect(runChitinContentAssayRecorder({ percentDryWeight: 0 })).toEqual({
      ok: true,
      output: { percentDryWeight: 0 },
    }));
  it("records fractional percentages", () =>
    expect(runChitinContentAssayRecorder({ percentDryWeight: 4.9 })).toEqual({
      ok: true,
      output: { percentDryWeight: 4.9 },
    }));
  it("preserves five percent", () =>
    expect(runChitinContentAssayRecorder({ percentDryWeight: 5 })).toEqual({
      ok: true,
      output: { percentDryWeight: 5 },
    }));
  it("preserves twenty percent", () =>
    expect(runChitinContentAssayRecorder({ percentDryWeight: 20 })).toEqual({
      ok: true,
      output: { percentDryWeight: 20 },
    }));
  it("does not invent a class above twenty percent", () =>
    expect(runChitinContentAssayRecorder({ percentDryWeight: 20.1 })).toEqual({
      ok: true,
      output: { percentDryWeight: 20.1 },
    }));
  it("accepts one hundred percent", () =>
    expect(runChitinContentAssayRecorder({ percentDryWeight: 100 })).toEqual({
      ok: true,
      output: { percentDryWeight: 100 },
    }));
  it("rejects values above one hundred percent", () =>
    expect(runChitinContentAssayRecorder({ percentDryWeight: 100.5 }).ok).toBe(
      false,
    ));
  it("rejects negative values", () =>
    expect(runChitinContentAssayRecorder({ percentDryWeight: -1 }).ok).toBe(
      false,
    ));
});
