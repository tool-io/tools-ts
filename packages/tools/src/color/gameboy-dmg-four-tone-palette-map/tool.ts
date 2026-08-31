import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly twoBitPixelCodes: readonly number[];
  readonly callerDmgShadeMapping: readonly number[];
}>;
export type Output = Readonly<{
  readonly mappedShadeIndices: readonly number[];
  readonly packedBgpRegisterByte: number;
}>;
const inputFields = [
  { id: "twoBitPixelCodes", label: "Two bit pixel codes", kind: "numberList" },
  {
    id: "callerDmgShadeMapping",
    label: "Caller dmg shade mapping",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.callerDmgShadeMapping.length !== 4)
    simpleError("mapping", "Exactly four explicit BGP shade indices required.");
  input.callerDmgShadeMapping.forEach((v) => bounded(v, "shade", 0, 3));
  input.twoBitPixelCodes.forEach((v) => bounded(v, "pixel", 0, 3));
  return {
    mappedShadeIndices: input.twoBitPixelCodes.map(
      (v) => input.callerDmgShadeMapping[v],
    ),
    packedBgpRegisterByte: input.callerDmgShadeMapping.reduce(
      (s, v, i) => s + (v << (2 * i)),
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  twoBitPixelCodes: [0, 1, 2, 3],
  callerDmgShadeMapping: [3, 2, 1, 0],
} satisfies Input;
export const exampleOutput = {
  mappedShadeIndices: [3, 2, 1, 0],
  packedBgpRegisterByte: 27,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/gameboy-dmg-four-tone-palette-map",
  title: "Game Boy DMG Four-Tone Palette Map",
  description:
    "Map actual Game Boy two-bit pixel codes through explicit four-shade BGP mapping and pack the register value; not arbitrary invented hardware RGB colors, LCD emulation or a ROM/hardware write.",
  inputs: inputFields,
  outputs: [
    {
      id: "mappedShadeIndices",
      label: "Mapped shade indices",
      kind: "numberList",
    },
    {
      id: "packedBgpRegisterByte",
      label: "Packed bgp register byte",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      twoBitPixelCodes: value.twoBitPixelCodes as readonly number[],
      callerDmgShadeMapping: value.callerDmgShadeMapping as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
