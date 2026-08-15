import { describe, expect, it } from "vitest";
import { calculateSpeedOfSound, runSpeedOfSound, speedOfSoundExample } from "./tool.js";

describe("speed of sound calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSpeedOfSound(speedOfSoundExample.input)).toEqual({
      ok: true,
      output: speedOfSoundExample.output,
    });
  });

  it("drops as temperature drops and rejects absolute zero", () => {
    const cold = calculateSpeedOfSound({ oatC: -55 });
    expect(cold.speedOfSoundKt).toBeLessThan(661);
    expect(runSpeedOfSound({ oatC: -273.16 }).ok).toBe(false);
  });
});
