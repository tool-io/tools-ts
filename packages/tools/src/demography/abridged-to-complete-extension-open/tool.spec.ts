import { describe, expect, it } from "vitest";
import {
  calculateAbridgedToCompleteExtensionOpen,
  runAbridgedToCompleteExtensionOpen,
  abridgedToCompleteExtensionOpenExample,
} from "./tool.js";

describe("demography/abridged-to-complete-extension-open", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAbridgedToCompleteExtensionOpen(
        abridgedToCompleteExtensionOpenExample.input,
      ),
    ).toEqual({
      ok: true,
      output: abridgedToCompleteExtensionOpenExample.output,
    });
  });

  it("scales linearly with the survivors", () => {
    expect(
      calculateAbridgedToCompleteExtensionOpen({ lx: 10000, nmx: 0.2 }),
    ).toEqual({
      openIntervalPersonYears: 50000,
      terminalExpectancy: 5,
    });
  });

  it("rejects non-positive survivors or rates", () => {
    expect(runAbridgedToCompleteExtensionOpen({ lx: 0, nmx: 0.25 }).ok).toBe(
      false,
    );
    expect(runAbridgedToCompleteExtensionOpen({ lx: 5000, nmx: -1 }).ok).toBe(
      false,
    );
  });
});
