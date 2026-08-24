import { describe, expect, it } from "vitest";
import {
  calculateNameFormNormalizerSurnameFirst,
  nameFormNormalizerSurnameFirstExample,
  runNameFormNormalizerSurnameFirst,
} from "./tool.js";

describe("archival-studies/name-form-normalizer-surname-first", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNameFormNormalizerSurnameFirst(
        nameFormNormalizerSurnameFirstExample.input,
      ),
    ).toEqual({
      ok: true,
      output: nameFormNormalizerSurnameFirstExample.output,
    });
  });

  it("keeps already-inverted names and single names stable", () => {
    expect(
      calculateNameFormNormalizerSurnameFirst({
        fullName: "Beethoven, Ludwig van",
      }),
    ).toEqual({
      normalizedName: "Beethoven, Ludwig van",
      surname: "Beethoven",
      forenames: "Ludwig van",
    });
    expect(
      calculateNameFormNormalizerSurnameFirst({ fullName: "Aristotle" }),
    ).toEqual({
      normalizedName: "Aristotle",
      surname: "Aristotle",
      forenames: "",
    });
  });

  it("keeps contiguous surname particles with the surname", () => {
    expect(
      calculateNameFormNormalizerSurnameFirst({
        fullName: "Miguel de la Cruz",
      }),
    ).toEqual({
      normalizedName: "de la Cruz, Miguel",
      surname: "de la Cruz",
      forenames: "Miguel",
    });
  });

  it("rejects empty and comma-only names", () => {
    expect(runNameFormNormalizerSurnameFirst({ fullName: "   " }).ok).toBe(
      false,
    );
    expect(runNameFormNormalizerSurnameFirst({ fullName: ", Ludwig" }).ok).toBe(
      false,
    );
  });
});
