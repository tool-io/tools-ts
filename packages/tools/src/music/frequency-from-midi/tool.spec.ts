import { describe, expect, it } from "vitest";
import { runFrequencyFromMidi } from "./tool.js";

describe("Frequency From MIDI Calculator", () => {
  it("maps MIDI 69 to concert A 440 Hz", () => {
    expect(runFrequencyFromMidi({ midi: 69 })).toEqual({
      ok: true,
      output: { hz: 440 },
    });
  });

  it("calculates an octave up and down", () => {
    const up = runFrequencyFromMidi({ midi: 81 });
    if (!up.ok) throw new Error("expected success");
    expect(up.output).toMatchObject({ hz: 880 });
    const down = runFrequencyFromMidi({ midi: 57 });
    if (!down.ok) throw new Error("expected success");
    expect(down.output).toMatchObject({ hz: 220 });
  });

  it("rejects invalid input", () =>
    expect(runFrequencyFromMidi(null).ok).toBe(false));
});
