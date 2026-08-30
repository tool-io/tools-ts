import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArbeitsplattenUeberstandInput = Readonly<{
  readonly countertopDepthMillimeters: number;
  readonly cabinetDepthMillimeters: number;
  readonly rearAllowanceMillimeters: number;
}>;
export type ArbeitsplattenUeberstandOutput = Readonly<{
  readonly frontOverhangMillimeters: number;
}>;

export const calculateArbeitsplattenUeberstand = (
  x: ArbeitsplattenUeberstandInput,
): ArbeitsplattenUeberstandOutput => {
  if (
    !Number.isFinite(x.countertopDepthMillimeters) ||
    x.countertopDepthMillimeters < 0
  )
    simpleError(
      "countertopDepthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.cabinetDepthMillimeters) ||
    x.cabinetDepthMillimeters < 0
  )
    simpleError(
      "cabinetDepthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.rearAllowanceMillimeters) ||
    x.rearAllowanceMillimeters < 0
  )
    simpleError(
      "rearAllowanceMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    x.countertopDepthMillimeters <
    x.cabinetDepthMillimeters + x.rearAllowanceMillimeters
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const frontOverhangMillimeters =
    x.countertopDepthMillimeters -
    x.cabinetDepthMillimeters -
    x.rearAllowanceMillimeters;
  if (!Number.isFinite(frontOverhangMillimeters))
    simpleError(
      "frontOverhangMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    frontOverhangMillimeters: Object.is(frontOverhangMillimeters, -0)
      ? 0
      : frontOverhangMillimeters,
  };
};

export const example = {
  input: {
    countertopDepthMillimeters: 635,
    cabinetDepthMillimeters: 600,
    rearAllowanceMillimeters: 15,
  },
  output: { frontOverhangMillimeters: 20 },
} satisfies ToolExample<
  ArbeitsplattenUeberstandInput,
  ArbeitsplattenUeberstandOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/arbeitsplatten-ueberstand",
  title: "Arbeitsplatten Ueberstand",
  description:
    "Countertop front overhang beyond cabinet depth after subtracting an optional rear backsplash or wall allowance.",
  inputs: [
    {
      id: "countertopDepthMillimeters",
      kind: "number",
      label: "Countertop Depth Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "cabinetDepthMillimeters",
      kind: "number",
      label: "Cabinet Depth Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "rearAllowanceMillimeters",
      kind: "number",
      label: "Rear Allowance Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "frontOverhangMillimeters",
      kind: "number",
      label: "Front Overhang Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateArbeitsplattenUeberstand({
      countertopDepthMillimeters: input.countertopDepthMillimeters as number,
      cabinetDepthMillimeters: input.cabinetDepthMillimeters as number,
      rearAllowanceMillimeters: input.rearAllowanceMillimeters as number,
    }),
});
export const arbeitsplattenUeberstandTool = tool;
export const runArbeitsplattenUeberstand = tool.execute;
export default tool;
