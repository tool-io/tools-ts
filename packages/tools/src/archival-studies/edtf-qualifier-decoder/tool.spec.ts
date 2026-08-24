import { describe, expect, it } from "vitest";
import {
  calculateEdtfQualifierDecoder,
  edtfQualifierDecoderExample,
  runEdtfQualifierDecoder,
} from "./tool.js";

describe("archival-studies/edtf-qualifier-decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEdtfQualifierDecoder(edtfQualifierDecoderExample.input)).toEqual({
      ok: true,
      output: edtfQualifierDecoderExample.output,
    });
  });

  it("decodes question marks and tildes, leaving plain values untouched", () => {
    expect(
      calculateEdtfQualifierDecoder({ edtfValue: "1984-06~" }),
    ).toMatchObject({
      baseValue: "1984-06",
      qualifier: "approximate",
    });
    expect(calculateEdtfQualifierDecoder({ edtfValue: "1841?" })).toMatchObject(
      {
        qualifier: "uncertain",
      },
    );
    expect(calculateEdtfQualifierDecoder({ edtfValue: "1984" })).toMatchObject({
      qualifier: "none",
      meaning: "no qualifier",
    });
  });

  it("rejects bare qualifiers and empty values", () => {
    expect(runEdtfQualifierDecoder({ edtfValue: "?" }).ok).toBe(false);
    expect(runEdtfQualifierDecoder({ edtfValue: "  " }).ok).toBe(false);
  });
});
