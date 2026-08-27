import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MaterialBalanceOilInitiallyInPlaceInput = {
  readonly areaSquareKilometers: number;
  readonly netThicknessM: number;
  readonly porosity: number;
  readonly waterSaturation: number;
  readonly oilFormationVolumeFactor: number;
};

export type MaterialBalanceOilInitiallyInPlaceOutput = {
  readonly reservoirOilVolumeM3: number;
  readonly oilInitiallyInPlaceM3: number;
};

export const calculateMaterialBalanceOilInitiallyInPlace = (
  input: MaterialBalanceOilInitiallyInPlaceInput,
): MaterialBalanceOilInitiallyInPlaceOutput => {
  if (!(input.areaSquareKilometers > 0))
    simpleError(
      "areaSquareKilometers",
      "Drainage area must be positive.",
      "invalid_area",
    );
  if (!(input.netThicknessM > 0))
    simpleError(
      "netThicknessM",
      "Net thickness must be positive.",
      "invalid_thickness",
    );
  if (!(input.porosity > 0 && input.porosity <= 1))
    simpleError(
      "porosity",
      "Porosity must lie between zero and one.",
      "invalid_porosity",
    );
  if (!(input.waterSaturation >= 0 && input.waterSaturation < 1))
    simpleError(
      "waterSaturation",
      "Water saturation must lie in the interval zero to one.",
      "invalid_saturation",
    );
  if (!(input.oilFormationVolumeFactor > 0))
    simpleError(
      "oilFormationVolumeFactor",
      "Formation volume factor must be positive.",
      "invalid_factor",
    );
  const reservoirOilVolumeM3 =
    input.areaSquareKilometers *
    1e6 *
    input.netThicknessM *
    input.porosity *
    (1 - input.waterSaturation);
  return {
    reservoirOilVolumeM3,
    oilInitiallyInPlaceM3:
      reservoirOilVolumeM3 / input.oilFormationVolumeFactor,
  };
};

export const materialBalanceOilInitiallyInPlaceExample = {
  input: {
    areaSquareKilometers: 10,
    netThicknessM: 20,
    porosity: 0.2,
    waterSaturation: 0.3,
    oilFormationVolumeFactor: 1.2,
  },
  output: {
    reservoirOilVolumeM3: 28000000,
    oilInitiallyInPlaceM3: 23333333.333333336,
  },
} satisfies ToolExample<
  MaterialBalanceOilInitiallyInPlaceInput,
  MaterialBalanceOilInitiallyInPlaceOutput
>;

export const materialBalanceOilInitiallyInPlaceTool = createSimpleTool({
  id: "geology/material-balance-oil-initially-in-place",
  title: "Material Balance Oil Initially In Place Calculator",
  description:
    "Estimate the volumetric oil initially in place from drainage area, net thickness, porosity, water saturation and oil formation volume factor.",
  inputs: [
    {
      description: "Drainage area in square kilometres.",
      id: "areaSquareKilometers",
      kind: "number",
      label: "Area",
    },
    {
      description: "Net pay thickness in metres.",
      id: "netThicknessM",
      kind: "number",
      label: "Net thickness",
    },
    {
      description: "Porosity as a volume fraction.",
      id: "porosity",
      kind: "number",
      label: "Porosity",
      maximum: 1,
    },
    {
      description: "Initial water saturation as a fraction.",
      id: "waterSaturation",
      kind: "number",
      label: "Sw",
    },
    {
      description:
        "Oil formation volume factor Bo in reservoir cubic metres per stock-tank cubic metre.",
      id: "oilFormationVolumeFactor",
      kind: "number",
      label: "Bo",
    },
  ],
  outputs: [
    {
      description: "Oil volume at reservoir conditions in cubic metres.",
      id: "reservoirOilVolumeM3",
      kind: "number",
      label: "Reservoir oil volume",
    },
    {
      description:
        "Oil initially in place at stock-tank conditions in cubic metres.",
      id: "oilInitiallyInPlaceM3",
      kind: "number",
      label: "OOIP",
    },
  ],
  calculate: (input) =>
    calculateMaterialBalanceOilInitiallyInPlace(
      input as unknown as MaterialBalanceOilInitiallyInPlaceInput,
    ),
});

export const runMaterialBalanceOilInitiallyInPlace =
  materialBalanceOilInitiallyInPlaceTool.execute;
export default materialBalanceOilInitiallyInPlaceTool;
