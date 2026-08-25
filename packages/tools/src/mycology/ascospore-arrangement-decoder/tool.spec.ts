import { describe, expect, it } from "vitest";
import {
  ascosporeArrangementDecoderExample,
  ascosporeArrangementDecoderTool,
  runAscosporeArrangementDecoder,
} from "./tool.js";

describe("ascosporeArrangementDecoderTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAscosporeArrangementDecoder(ascosporeArrangementDecoderExample.input),
    ).toEqual({
      ok: true,
      output: ascosporeArrangementDecoderExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(ascosporeArrangementDecoderExample)),
    ).toEqual(ascosporeArrangementDecoderExample);
    expect(ascosporeArrangementDecoderTool.contractVersion).toBe(1);
    expect(ascosporeArrangementDecoderTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("passes through the uniseriate arrangement", () => {
    const r = runAscosporeArrangementDecoder({ arrangement: "uniseriate" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.arrangementClass).toBe("uniseriate");
  });

  it("passes through the biseriate and multiseriate arrangements", () => {
    const biseriate = runAscosporeArrangementDecoder({
      arrangement: "biseriate",
    });
    const multiseriate = runAscosporeArrangementDecoder({
      arrangement: "multiseriate",
    });
    if (!biseriate.ok || !multiseriate.ok) throw new Error("expected success");
    expect(biseriate.output.arrangementClass).toBe("biseriate");
    expect(multiseriate.output.arrangementClass).toBe("multiseriate");
  });

  it("passes through the fasciculate arrangement", () => {
    const r = runAscosporeArrangementDecoder({ arrangement: "fasciculate" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.arrangementClass).toBe("fasciculate");
  });

  it("rejects unknown arrangements", () => {
    expect(runAscosporeArrangementDecoder({ arrangement: "spiral" }).ok).toBe(
      false,
    );
    expect(runAscosporeArrangementDecoder({ arrangement: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runAscosporeArrangementDecoder(null).ok).toBe(false);
    expect(runAscosporeArrangementDecoder({ arrangement: true }).ok).toBe(
      false,
    );
    expect(
      runAscosporeArrangementDecoder({
        ...ascosporeArrangementDecoderExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
