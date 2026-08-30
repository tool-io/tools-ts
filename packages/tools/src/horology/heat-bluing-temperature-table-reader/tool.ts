import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatBluingBand = readonly [
  minimumCelsius: number,
  maximumCelsius: number,
];

export type HeatBluingTableInput = {
  readonly bandNames: readonly string[];
  readonly targetTemperatureCelsius: number;
  readonly temperatureBands: readonly (readonly number[])[];
};

export type HeatBluingTableOutput = {
  readonly matchedBandCelsius: readonly number[];
  readonly matchedBandIndex: number;
  readonly matchedBandName: string;
  readonly tableCaveat: string;
};

export const readHeatBluingTemperatureTable = (
  input: HeatBluingTableInput,
): HeatBluingTableOutput => {
  if (
    input.temperatureBands.length < 1 ||
    input.bandNames.length !== input.temperatureBands.length
  )
    simpleError(
      "temperatureBands",
      "Each temperature band must have one name.",
      "band_table_shape_invalid",
    );
  if (input.temperatureBands.some((row) => row.length !== 2))
    simpleError(
      "temperatureBands",
      "Each temperature band must contain minimum and maximum temperatures.",
      "band_shape_invalid",
    );
  if (!Number.isFinite(input.targetTemperatureCelsius))
    simpleError(
      "targetTemperatureCelsius",
      "Target temperature must be finite.",
      "target_temperature_invalid",
    );
  const bands = input.temperatureBands.map(
    ([minimumCelsius, maximumCelsius]) => ({
      maximumCelsius,
      minimumCelsius,
    }),
  );
  for (const [index, band] of bands.entries()) {
    if (
      !Number.isFinite(band.minimumCelsius) ||
      !Number.isFinite(band.maximumCelsius) ||
      band.maximumCelsius < band.minimumCelsius
    )
      simpleError(
        "temperatureBands",
        "Temperature-band bounds must be finite and ordered.",
        "band_values_invalid",
      );
    if (index > 0) {
      const previousBand = bands[index - 1];
      if (
        previousBand === undefined ||
        band.minimumCelsius < previousBand.maximumCelsius
      )
        simpleError(
          "temperatureBands",
          "Temperature bands must be ordered and must not overlap.",
          "bands_not_ordered",
        );
    }
  }
  const matchedBandIndex = bands.findIndex(
    (band, index) =>
      input.targetTemperatureCelsius >= band.minimumCelsius &&
      (input.targetTemperatureCelsius < band.maximumCelsius ||
        (index === bands.length - 1 &&
          input.targetTemperatureCelsius <= band.maximumCelsius)),
  );
  if (matchedBandIndex < 0)
    simpleError(
      "targetTemperatureCelsius",
      "Target temperature is outside the caller-supplied table.",
      "target_outside_table",
    );
  const matchedBand = bands[matchedBandIndex];
  const matchedBandName = input.bandNames[matchedBandIndex];
  if (matchedBand === undefined || matchedBandName === undefined)
    simpleError(
      "temperatureBands",
      "The matching band is incomplete.",
      "band_data_missing",
    );
  return {
    matchedBandCelsius: [
      matchedBand.minimumCelsius,
      matchedBand.maximumCelsius,
    ],
    matchedBandIndex,
    matchedBandName,
    tableCaveat:
      "Oxide color depends on alloy, surface, time, heating rate, and viewing conditions; this is a lookup of caller-supplied bands, not a universal steel chart.",
  };
};

export const heatBluingTableExample = {
  input: {
    bandNames: ["straw", "purple", "blue"],
    targetTemperatureCelsius: 295,
    temperatureBands: [
      [220, 260],
      [260, 290],
      [290, 310],
    ],
  },
  output: {
    matchedBandCelsius: [290, 310],
    matchedBandIndex: 2,
    matchedBandName: "blue",
    tableCaveat:
      "Oxide color depends on alloy, surface, time, heating rate, and viewing conditions; this is a lookup of caller-supplied bands, not a universal steel chart.",
  },
} satisfies ToolExample<HeatBluingTableInput, HeatBluingTableOutput>;

export const heatBluingTableTool = createSimpleTool({
  calculate: (input) =>
    readHeatBluingTemperatureTable({
      bandNames: input.bandNames as string[],
      targetTemperatureCelsius: input.targetTemperatureCelsius as number,
      temperatureBands: input.temperatureBands as number[][],
    }),
  description:
    "Read a target temperature from a caller-supplied heat-bluing color table while preserving material, time, heating-rate, surface, and lighting limitations.",
  id: "horology/heat-bluing-temperature-table-reader",
  inputs: [
    {
      description: "Band names correspond by index to temperatureBands rows.",
      id: "bandNames",
      kind: "stringList",
      label: "Caller-supplied color-band names",
    },
    {
      id: "targetTemperatureCelsius",
      kind: "number",
      label: "Target metal temperature",
      unit: "degC",
    },
    {
      description:
        "Rows contain [minimum Celsius, maximum Celsius] and must be ordered.",
      id: "temperatureBands",
      kind: "matrix",
      label: "Caller-supplied temperature bands",
    },
  ],
  outputs: [
    {
      id: "matchedBandCelsius",
      kind: "numberList",
      label: "Matched temperature band",
      unit: "degC",
    },
    {
      id: "matchedBandIndex",
      kind: "integer",
      label: "Matched band index",
      minimum: 0,
    },
    { id: "matchedBandName", kind: "string", label: "Matched color-band name" },
    { id: "tableCaveat", kind: "string", label: "Heat-bluing table caveat" },
  ],
  title: "Heat Bluing Temperature Table Reader",
});

export const runHeatBluingTable = heatBluingTableTool.execute;
export default heatBluingTableTool;
