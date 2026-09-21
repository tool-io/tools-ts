import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowSpacing: number;
  readonly leftCanopyRadius: number;
  readonly rightCanopyRadius: number;
  readonly implementWidth: number;
  readonly sideMargin: number;
};
export type Output = {
  readonly clearAlley: number;
  readonly totalRequiredWidth: number;
  readonly clearanceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowSpacing: { type: "number", minimum: 0 },
    leftCanopyRadius: { type: "number", minimum: 0 },
    rightCanopyRadius: { type: "number", minimum: 0 },
    implementWidth: { type: "number", minimum: 0 },
    sideMargin: { type: "number", minimum: 0 },
  },
  required: [
    "rowSpacing",
    "leftCanopyRadius",
    "rightCanopyRadius",
    "implementWidth",
    "sideMargin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearAlley: { type: "number" },
    totalRequiredWidth: { type: "number" },
    clearanceGap: { type: "number" },
  },
  required: ["clearAlley", "totalRequiredWidth", "clearanceGap"],
} as const;
/** Calculate alley operation clearance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rowSpacing,
    leftCanopyRadius,
    rightCanopyRadius,
    implementWidth,
    sideMargin,
  } = request;
  const compute = (): Output => {
    H.domain(
      rowSpacing >= 0 &&
        leftCanopyRadius >= 0 &&
        rightCanopyRadius >= 0 &&
        implementWidth >= 0 &&
        sideMargin >= 0,
    );
    return {
      clearAlley: rowSpacing - leftCanopyRadius - rightCanopyRadius,
      totalRequiredWidth: implementWidth + 2 * sideMargin,
      clearanceGap:
        rowSpacing -
        leftCanopyRadius -
        rightCanopyRadius -
        implementWidth -
        2 * sideMargin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rowSpacing: 12,
    leftCanopyRadius: 2,
    rightCanopyRadius: 3,
    implementWidth: 4,
    sideMargin: 1,
  },
  output: { clearAlley: 7, totalRequiredWidth: 6, clearanceGap: 1 },
} satisfies ToolExample<Input, Output>;
export const alleyOperationClearanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/alley-operation-clearance-gap",
    title: "Alley Operation Clearance Gap Tool",
    description:
      "Calculate alley operation clearance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowSpacing: { type: "number", minimum: 0 },
        leftCanopyRadius: { type: "number", minimum: 0 },
        rightCanopyRadius: { type: "number", minimum: 0 },
        implementWidth: { type: "number", minimum: 0 },
        sideMargin: { type: "number", minimum: 0 },
      },
      required: [
        "rowSpacing",
        "leftCanopyRadius",
        "rightCanopyRadius",
        "implementWidth",
        "sideMargin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearAlley: { type: "number" },
        totalRequiredWidth: { type: "number" },
        clearanceGap: { type: "number" },
      },
      required: ["clearAlley", "totalRequiredWidth", "clearanceGap"],
    },
    ports: {
      inputs: [
        {
          id: "rowSpacing",
          label: "Row Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftCanopyRadius",
          label: "Left Canopy Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightCanopyRadius",
          label: "Right Canopy Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "implementWidth",
          label: "Implement Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sideMargin",
          label: "Side Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "clearAlley",
          label: "Clear Alley",
          valueType: { type: "number" },
        },
        {
          id: "totalRequiredWidth",
          label: "Total Required Width",
          valueType: { type: "number" },
        },
        {
          id: "clearanceGap",
          label: "Clearance Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = alleyOperationClearanceGapTool.execute;
export default alleyOperationClearanceGapTool;
