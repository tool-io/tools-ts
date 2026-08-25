import { describe, expect, it } from "vitest";
import {
  amphoBreakpointMapperExample,
  amphoBreakpointMapperTool,
  runAmphoBreakpointMapper,
} from "./tool.js";

describe("Ampho Breakpoint Mapper", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runAmphoBreakpointMapper(amphoBreakpointMapperExample.input),
    ).toEqual({
      ok: true,
      output: amphoBreakpointMapperExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(amphoBreakpointMapperExample))).toEqual(
      amphoBreakpointMapperExample,
    );
    expect(amphoBreakpointMapperTool.contractVersion).toBe(1);
    expect(amphoBreakpointMapperTool.execution).toEqual({ kind: "pure" });
  });

  it("maps values between caller-supplied thresholds to intermediate", () => {
    expect(
      runAmphoBreakpointMapper({
        micMgPerL: 2,
        resistantMinimumMgPerL: 4,
        susceptibleMaximumMgPerL: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        breakpointCategory: "intermediate",
        criteriaSource: "caller-supplied",
      },
    });
  });

  it("maps the resistant boundary inclusively", () => {
    const result = runAmphoBreakpointMapper({
      micMgPerL: 4,
      resistantMinimumMgPerL: 4,
      susceptibleMaximumMgPerL: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.breakpointCategory).toBe("resistant");
  });

  it("rejects inverted or equal caller-supplied thresholds", () => {
    expect(
      runAmphoBreakpointMapper({
        micMgPerL: 1,
        resistantMinimumMgPerL: 1,
        susceptibleMaximumMgPerL: 1,
      }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runAmphoBreakpointMapper(null).ok).toBe(false);
    expect(runAmphoBreakpointMapper({ micMgPerL: "1" }).ok).toBe(false);
    expect(
      runAmphoBreakpointMapper({
        ...amphoBreakpointMapperExample.input,
        extra: 1,
      }).ok,
    ).toBe(false);
  });
});
