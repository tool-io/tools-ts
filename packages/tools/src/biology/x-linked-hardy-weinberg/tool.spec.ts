import { describe, expect, it } from "vitest";
import {
  runXLinkedHardyWeinberg,
  xLinkedHardyWeinbergExample,
} from "./tool.js";

describe("X-Linked Male Frequency", () => {
  it("publishes an executable example", () =>
    expect(runXLinkedHardyWeinberg(xLinkedHardyWeinbergExample.input)).toEqual({
      ok: true,
      output: xLinkedHardyWeinbergExample.output,
    }));
  it("returns q directly for hemizygous males", () =>
    expect(runXLinkedHardyWeinberg({ recessiveAlleleFrequency: 0.04 })).toEqual(
      { ok: true, output: { affectedMaleFrequency: 0.04 } },
    ));
  it("yields zero when the allele is absent", () =>
    expect(runXLinkedHardyWeinberg({ recessiveAlleleFrequency: 0 })).toEqual({
      ok: true,
      output: { affectedMaleFrequency: 0 },
    }));
  it("yields one when the allele is fixed", () =>
    expect(runXLinkedHardyWeinberg({ recessiveAlleleFrequency: 1 })).toEqual({
      ok: true,
      output: { affectedMaleFrequency: 1 },
    }));
  it("rejects frequencies above one", () =>
    expect(runXLinkedHardyWeinberg({ recessiveAlleleFrequency: 1.5 }).ok).toBe(
      false,
    ));
  it("rejects negative frequencies", () =>
    expect(runXLinkedHardyWeinberg({ recessiveAlleleFrequency: -0.1 }).ok).toBe(
      false,
    ));
  it("rejects missing inputs", () =>
    expect(runXLinkedHardyWeinberg({}).ok).toBe(false));
});
