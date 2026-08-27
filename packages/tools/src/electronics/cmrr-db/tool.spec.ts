import { describe, expect, it } from "vitest";
import { cmrrDbExample, runCmrrDb } from "./tool.js";
describe("CMRR dB", () => {
  it("publishes an executable example", () =>
    expect(runCmrrDb(cmrrDbExample.input)).toEqual({
      ok: true,
      output: cmrrDbExample.output,
    }));
  it("yields zero when gains match", () =>
    expect(runCmrrDb({ differentialGain: 50, commonModeGain: 50 })).toEqual({
      ok: true,
      output: { cmrrDb: 0 },
    }));
  it("rejects zero common mode gain", () =>
    expect(runCmrrDb({ differentialGain: 10, commonModeGain: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative differential gain", () =>
    expect(runCmrrDb({ differentialGain: -1, commonModeGain: 1 }).ok).toBe(
      false,
    ));
});
