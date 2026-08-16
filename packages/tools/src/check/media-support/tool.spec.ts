import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateMediaSupport,
  mediaSupportExample,
  mediaSupportTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateMediaSupport>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Media Support Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = mediaSupportTool.execute(mediaSupportExample.input);
    expect(result).toEqual({ ok: true, output: mediaSupportExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(mediaSupportTool.id).toBe("check/media-support");
    expect(validateToolContract(mediaSupportTool)).toEqual([]);
  });

  it("classifies full support and total lack of it", () => {
    const ready = calculateMediaSupport({
      codecs: [
        { name: "h264", supported: true },
        { name: "vp9", supported: true },
      ],
    });
    expect(ready.ok).toBe(true);
    if (ready.ok) expect(ready.output.verdict).toBe("ready");
    const none = calculateMediaSupport({
      codecs: [{ name: "av1", supported: false }],
    });
    expect(none.ok).toBe(true);
    if (none.ok) {
      expect(none.output.verdict).toBe("none");
      expect(none.output.coveragePercent).toBe(0);
    }
  });

  it("reports no-data for an empty probe list", () => {
    const result = calculateMediaSupport({ codecs: [] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.verdict).toBe("no-data");
      expect(result.output.issues).toEqual(["no-codecs-reported"]);
      expect(result.output.coveragePercent).toBeNull();
    }
  });

  it("rejects malformed probe lists", () => {
    expect(calculateMediaSupport(null).ok).toBe(false);
    expect(issueCodes(calculateMediaSupport({}))).toEqual([
      "codecs_required",
    ]);
    expect(
      issueCodes(
        calculateMediaSupport({
          codecs: [
            { name: "h264" },
            { name: "", supported: true },
            "bogus",
          ],
        }),
      ),
    ).toEqual([
      "codec_supported_invalid",
      "codec_name_invalid",
      "codec_required",
    ]);
    expect(
      issueCodes(calculateMediaSupport({ codecs: [], extra: 1 })),
    ).toEqual(["unknown_field"]);
  });
});
