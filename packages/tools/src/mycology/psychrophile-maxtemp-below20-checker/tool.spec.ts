import { describe, expect, it } from "vitest";
import {
  psychrophileMaxtempBelow20CheckerExample,
  runPsychrophileMaxtempBelow20Checker,
} from "./tool.js";

describe("Psychrophile Checker", () => {
  it("matches the canonical example", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker(
        psychrophileMaxtempBelow20CheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: psychrophileMaxtempBelow20CheckerExample.output,
    }));
  it("reports cold maxima at or below twenty", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker({ maxGrowthTempC: -5 }),
    ).toEqual({
      ok: true,
      output: { maximumAtOrBelow20C: true },
    }));
  it("includes twenty degrees in the check", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker({ maxGrowthTempC: 20 }),
    ).toEqual({
      ok: true,
      output: { maximumAtOrBelow20C: true },
    }));
  it("reports false just above twenty degrees", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker({ maxGrowthTempC: 20.1 }),
    ).toEqual({ ok: true, output: { maximumAtOrBelow20C: false } }));
  it("does not infer psychrotolerance from thirty-five degrees", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker({ maxGrowthTempC: 35 }),
    ).toEqual({
      ok: true,
      output: { maximumAtOrBelow20C: false },
    }));
  it("reports false above thirty-five degrees", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker({ maxGrowthTempC: 35.1 }),
    ).toEqual({ ok: true, output: { maximumAtOrBelow20C: false } }));
  it("does not impose an arbitrary upper bound", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker({ maxGrowthTempC: 45 }),
    ).toEqual({
      ok: true,
      output: { maximumAtOrBelow20C: false },
    }));
  it("accepts temperatures below minus five", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker({ maxGrowthTempC: -6 }),
    ).toEqual({ ok: true, output: { maximumAtOrBelow20C: true } }));
  it("accepts temperatures above forty-five", () =>
    expect(
      runPsychrophileMaxtempBelow20Checker({ maxGrowthTempC: 46 }),
    ).toEqual({ ok: true, output: { maximumAtOrBelow20C: false } }));
});
