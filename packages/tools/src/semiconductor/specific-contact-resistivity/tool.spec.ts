import { describe, expect, it } from "vitest";
import {
  runSpecificContactResistivity,
  specificContactResistivityExample,
} from "./tool.js";

describe("specific contact resistivity", () => {
  it("reproduces the TLM example", () =>
    expect(
      runSpecificContactResistivity(specificContactResistivityExample.input),
    ).toEqual({ ok: true, output: specificContactResistivityExample.output }));
  it("scales with resistance, contact width, and transfer length", () =>
    expect(
      runSpecificContactResistivity({
        contactResistanceOhms: 50,
        contactWidthUm: 200,
        transferLengthUm: 2,
      }),
    ).toEqual({
      ok: true,
      output: { specificContactResistivityOhmCm2: 0.0002 },
    }));
  it("requires contact width", () =>
    expect(
      runSpecificContactResistivity({
        contactResistanceOhms: 100,
        transferLengthUm: 1,
      } as never),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "contactWidthUm" }] },
    }));
});
