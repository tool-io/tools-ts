import { describe, expect, it } from "vitest";
import { runFlotacTwoChamberEpg } from "./tool.js";
describe("Flotac Two-Chamber EPG", () => {
  it("averages both chambers with the default factor", () =>
    expect(
      runFlotacTwoChamberEpg({ eggsChamberOneInt: 30, eggsChamberTwoInt: 20 }),
    ).toEqual({ ok: true, output: { eggsPerGram: 125 } }));
  it("yields zero for empty chambers", () =>
    expect(
      runFlotacTwoChamberEpg({ eggsChamberOneInt: 0, eggsChamberTwoInt: 0 }),
    ).toEqual({ ok: true, output: { eggsPerGram: 0 } }));
  it("counts only the first chamber when the second is empty", () =>
    expect(
      runFlotacTwoChamberEpg({ eggsChamberOneInt: 40, eggsChamberTwoInt: 0 }),
    ).toEqual({ ok: true, output: { eggsPerGram: 100 } }));
  it("counts only the second chamber when the first is empty", () =>
    expect(
      runFlotacTwoChamberEpg({ eggsChamberOneInt: 0, eggsChamberTwoInt: 40 }),
    ).toEqual({ ok: true, output: { eggsPerGram: 100 } }));
  it("supports a unit flotation factor", () =>
    expect(
      runFlotacTwoChamberEpg({
        eggsChamberOneInt: 10,
        eggsChamberTwoInt: 10,
        flotationFactor: 1,
      }),
    ).toEqual({ ok: true, output: { eggsPerGram: 10 } }));
  it("honors a larger flotation factor", () =>
    expect(
      runFlotacTwoChamberEpg({
        eggsChamberOneInt: 6,
        eggsChamberTwoInt: 4,
        flotationFactor: 10,
      }),
    ).toEqual({ ok: true, output: { eggsPerGram: 50 } }));
  it("rejects negative chamber one counts", () =>
    expect(
      runFlotacTwoChamberEpg({ eggsChamberOneInt: -1, eggsChamberTwoInt: 0 })
        .ok,
    ).toBe(false));
  it("rejects negative chamber two counts", () =>
    expect(
      runFlotacTwoChamberEpg({ eggsChamberOneInt: 0, eggsChamberTwoInt: -2 })
        .ok,
    ).toBe(false));
  it("rejects flotation factors below one", () =>
    expect(
      runFlotacTwoChamberEpg({
        eggsChamberOneInt: 1,
        eggsChamberTwoInt: 1,
        flotationFactor: 0,
      }).ok,
    ).toBe(false));
});
