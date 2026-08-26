import { describe, expect, it } from "vitest";
import { sttlAcronymExpanderExample, runSttlAcronymExpander } from "./tool.js";

describe("sttl-acronym-expander", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSttlAcronymExpander(sttlAcronymExpanderExample.input)).toEqual({
      ok: true,
      output: sttlAcronymExpanderExample.output,
    });
  });

  it("finds no expansion when absent", () => {
    const r = runSttlAcronymExpander({ text: "DM", requireDots: false });
    expect(r.ok && (r.output.occurrences as number) === 0).toBe(true);
  });

  it("honors the require-dots option", () => {
    expect(runSttlAcronymExpander({ text: "STTL", requireDots: true })).toEqual(
      {
        ok: true,
        output: { expansion: "", dotted: false, occurrences: 0 },
      },
    );
    expect(
      runSttlAcronymExpander({ text: "S·T·T·L", requireDots: true }).ok,
    ).toBe(true);
  });
});
