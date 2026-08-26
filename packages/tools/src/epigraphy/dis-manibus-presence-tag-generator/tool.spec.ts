import { describe, expect, it } from "vitest";
import {
  calculateDisManibusPresenceTagGenerator,
  disManibusPresenceTagGeneratorExample,
  runDisManibusPresenceTagGenerator,
} from "./tool.js";

describe("epigraphy/dis-manibus-presence-tag-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDisManibusPresenceTagGenerator(
        disManibusPresenceTagGeneratorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: disManibusPresenceTagGeneratorExample.output,
    });
  });

  it("matches interpunct abbreviations and V spellings", () => {
    expect(
      calculateDisManibusPresenceTagGenerator({ text: "D\u00B7M\u00B7" })
        .present,
    ).toBe(true);
    expect(
      calculateDisManibusPresenceTagGenerator({
        text: "DIS MANIBVS ET SIT TIBI TERRA LEVIS",
      }).tagString,
    ).toBe("formula:dis-manibus");
  });

  it("tags absence explicitly", () => {
    expect(
      calculateDisManibusPresenceTagGenerator({ text: "HIC SITVS EST" }),
    ).toEqual({
      present: false,
      occurrenceCount: 0,
      tagString: "formula:none",
      matchText: "",
    });
  });

  it("rejects empty input", () => {
    expect(runDisManibusPresenceTagGenerator({ text: "" }).ok).toBe(false);
  });
});
