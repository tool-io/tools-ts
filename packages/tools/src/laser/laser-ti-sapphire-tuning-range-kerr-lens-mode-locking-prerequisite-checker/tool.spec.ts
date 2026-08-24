import { describe, expect, it } from "vitest";
import {
  klmPrerequisiteExample as example,
  runKlmPrerequisite,
} from "./tool.js";
describe("Ti:sapphire KLM prerequisite", () => {
  it("compares available and critical peak power", () =>
    expect(runKlmPrerequisite(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects negative available peak power", () =>
    expect(runKlmPrerequisite({ availablePeakPowerKw: -1 }).ok).toBe(false));
});
