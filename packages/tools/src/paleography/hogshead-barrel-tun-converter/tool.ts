import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HogsheadBarrelTunConverterInput = {
  readonly amount: number;
  readonly unit?: "tun" | "pipe" | "hogshead" | "barrel" | "tierce";
};

export type HogsheadBarrelTunConverterOutput = {
  readonly wineGallons: number;
  readonly tuns: number;
  readonly pipes: number;
  readonly hogsheads: number;
};

const GALLONS_PER_UNIT = {
  tun: 252,
  pipe: 126,
  hogshead: 63,
  barrel: 31.5,
  tierce: 42,
} as const;

export const calculateHogsheadBarrelTunConverter = (
  input: HogsheadBarrelTunConverterInput,
): HogsheadBarrelTunConverterOutput => {
  if (!(
    typeof input.amount === "number" &&
    Number.isFinite(input.amount) &&
    input.amount > 0
  ))
    return simpleError(
      "amount",
      "Amount must be a finite number greater than zero.",
      "invalid_amount",
    );
  const wineGallons = input.amount * GALLONS_PER_UNIT[input.unit ?? "hogshead"];
  const output = {
    wineGallons,
    tuns: wineGallons / 252,
    pipes: wineGallons / 126,
    hogsheads: wineGallons / 63,
  };
  if (
    Object.values(output).some((value) => !Number.isFinite(value) || value <= 0)
  )
    return simpleError(
      "amount",
      "Amount is outside the representable conversion range.",
      "invalid_amount",
    );
  return output;
};

export const hogsheadBarrelTunConverterExample = {
  input: { amount: 2, unit: "hogshead" },
  output: { wineGallons: 126, tuns: 0.5, pipes: 1, hogsheads: 2 },
} satisfies ToolExample<
  HogsheadBarrelTunConverterInput,
  HogsheadBarrelTunConverterOutput
>;

export const hogsheadBarrelTunConverterTool = createSimpleTool({
  id: "paleography/hogshead-barrel-tun-converter",
  title: "Hogshead Barrel Tun Converter",
  description:
    "Convert English wine-cask measures on the statutory ladder 1 tun = 2 pipes = 4 hogsheads = 252 wine gallons (barrel 31.5 gal, tierce 42 gal).",
  inputs: [
    {
      description: "Positive quantity of the chosen cask unit.",
      id: "amount",
      kind: "number",
      label: "Amount",
    },
    {
      default: "hogshead",
      description: "Cask unit of the entered amount.",
      enum: ["tun", "pipe", "hogshead", "barrel", "tierce"],
      id: "unit",
      kind: "string",
      label: "Unit",
    },
  ],
  outputs: [
    {
      description: "Volume in English wine gallons.",
      id: "wineGallons",
      kind: "number",
      label: "Wine gallons",
    },
    {
      description: "Volume in tuns.",
      id: "tuns",
      kind: "number",
      label: "Tuns",
    },
    {
      description: "Volume in pipes (butts).",
      id: "pipes",
      kind: "number",
      label: "Pipes",
    },
    {
      description: "Volume in hogsheads.",
      id: "hogsheads",
      kind: "number",
      label: "Hogsheads",
    },
  ],
  calculate: (input) =>
    calculateHogsheadBarrelTunConverter({
      amount: input.amount as number,
      unit: input.unit as HogsheadBarrelTunConverterInput["unit"],
    }),
});

export const runHogsheadBarrelTunConverter =
  hogsheadBarrelTunConverterTool.execute;
export default hogsheadBarrelTunConverterTool;
