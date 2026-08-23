import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type FieldElevationQnhInput = {
  readonly indicatedAltitudeFt: number;
  readonly qnhHpa: number;
};

export type FieldElevationQnhOutput = {
  readonly pressureAltitudeFt: number;
};

const FT_PER_HPA = 27;

export const fieldElevationQnhExample = {
  input: { indicatedAltitudeFt: 2000, qnhHpa: 993.25 },
} satisfies ToolExample<FieldElevationQnhInput>;

export const fieldElevationQnhTool = createSimpleTool({
  id: "aviation/field-elevation-qnh",
  title: "Pressure Altitude From QNH Calculator",
  description:
    "Convert an indicated altitude and QNH into pressure altitude at 27 feet per hectopascal.",
  inputs: [
    {
      id: "indicatedAltitudeFt",
      label: "Indicated altitude",
      kind: "number",
      unit: "ft",
    },
    {
      id: "qnhHpa",
      label: "QNH",
      kind: "number",
      maximum: 1100,
      minimum: 300,
      unit: "hPa",
    },
  ],
  outputs: [
    {
      id: "pressureAltitudeFt",
      label: "Pressure altitude",
      kind: "number",
      unit: "ft",
    },
  ],
  calculate: (input) => ({
    pressureAltitudeFt:
      (input.indicatedAltitudeFt as number) -
      ((input.qnhHpa as number) - 1013.25) * FT_PER_HPA,
  }),
});
export const runFieldElevationQnh = fieldElevationQnhTool.execute;
export default fieldElevationQnhTool;
