import { describe, expect, it } from "vitest";
import { runTranscriptLength } from "./tool.js";

describe("Transcript Length nt", () => {
  it("passes through a valid length", () =>
    expect(runTranscriptLength({ lengthNt: 850 })).toEqual({
      ok: true,
      output: { transcriptLengthNt: 850 },
    }));
  it("accepts the smallest transcript of one nucleotide", () =>
    expect(runTranscriptLength({ lengthNt: 1 })).toEqual({
      ok: true,
      output: { transcriptLengthNt: 1 },
    }));
  it("passes through long transcripts", () =>
    expect(runTranscriptLength({ lengthNt: 9876543 })).toEqual({
      ok: true,
      output: { transcriptLengthNt: 9876543 },
    }));
  it("rejects zero-length transcripts", () =>
    expect(runTranscriptLength({ lengthNt: 0 }).ok).toBe(false));
  it("rejects negative lengths", () =>
    expect(runTranscriptLength({ lengthNt: -850 }).ok).toBe(false));
  it("rejects fractional lengths", () =>
    expect(runTranscriptLength({ lengthNt: 850.25 }).ok).toBe(false));
});
