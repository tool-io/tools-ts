import { describe, expect, it } from "vitest";
import {
  heatBluingTableExample,
  readHeatBluingTemperatureTable,
  runHeatBluingTable,
} from "./tool.js";

describe("heat-bluing temperature-table reader", () => {
  it("reproduces the canonical blue-band example", () => {
    expect(runHeatBluingTable(heatBluingTableExample.input)).toEqual({
      ok: true,
      output: heatBluingTableExample.output,
    });
  });

  it("accepts the lower band boundary", () => {
    expect(
      readHeatBluingTemperatureTable({
        bandNames: ["straw", "purple"],
        temperatureBands: [
          [220, 260],
          [260, 290],
        ],
        targetTemperatureCelsius: 260,
      }).matchedBandIndex,
    ).toBe(1);
  });

  it("rejects a target outside the caller table", () => {
    expect(
      runHeatBluingTable({
        bandNames: ["blue"],
        temperatureBands: [[290, 310]],
        targetTemperatureCelsius: 350,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "target_outside_table", field: "targetTemperatureCelsius" },
        ],
      },
      ok: false,
    });
  });

  it("rejects mismatched names and bands", () => {
    expect(
      runHeatBluingTable({
        bandNames: ["blue"],
        temperatureBands: [
          [220, 260],
          [260, 290],
        ],
        targetTemperatureCelsius: 250,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "band_table_shape_invalid", field: "temperatureBands" },
        ],
      },
      ok: false,
    });
  });

  it("rejects unordered bands", () => {
    expect(
      runHeatBluingTable({
        bandNames: ["high", "low"],
        temperatureBands: [
          [260, 290],
          [220, 260],
        ],
        targetTemperatureCelsius: 250,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "bands_not_ordered", field: "temperatureBands" }],
      },
      ok: false,
    });
  });
});
