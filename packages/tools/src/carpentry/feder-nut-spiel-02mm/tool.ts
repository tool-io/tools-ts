import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TongueGrooveClearanceInput = {
  readonly tongueThicknessMm: number;
};

export type TongueGrooveClearanceOutput = {
  readonly grooveWidthMm: number;
};

export const tongueGrooveClearanceExample = {
  input: { tongueThicknessMm: 12 },
  output: { grooveWidthMm: 12.2 },
} satisfies ToolExample<
  TongueGrooveClearanceInput,
  TongueGrooveClearanceOutput
>;

export const tongueGrooveClearanceTool = createSimpleTool({
  id: "carpentry/feder-nut-spiel-02mm",
  title: "Tongue Groove Clearance Calculator",
  description:
    "Compute the groove width for a tongue joint by adding a 0.2 mm fitting clearance to the tongue thickness.",
  inputs: [
    {
      description: "Tongue thickness in millimeters.",
      id: "tongueThicknessMm",
      kind: "number",
      label: "Tongue thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Groove width in millimeters, the tongue thickness plus a 0.2 mm clearance.",
      id: "grooveWidthMm",
      kind: "number",
      label: "Groove width",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const tongueThicknessMm = input.tongueThicknessMm as number;
    if (!(tongueThicknessMm > 0))
      simpleError(
        "tongueThicknessMm",
        "Tongue thickness must be greater than zero.",
        "must_be_positive",
      );
    return { grooveWidthMm: tongueThicknessMm + 0.2 };
  },
});
export const runTongueGrooveClearance = tongueGrooveClearanceTool.execute;
export default tongueGrooveClearanceTool;
