import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowSpacing: number;
  readonly firstEncroachment: number;
  readonly secondEncroachment: number;
};
export type Output = { readonly usableWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowSpacing: { type: "number", minimum: 0 },
    firstEncroachment: { type: "number", minimum: 0 },
    secondEncroachment: { type: "number", minimum: 0 },
  },
  required: ["rowSpacing", "firstEncroachment", "secondEncroachment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableWidth: { type: "number" } },
  required: ["usableWidth"],
} as const;
/** Calculate crop alley usable width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowSpacing, firstEncroachment, secondEncroachment } = request;
  const compute = (): Output => {
    H.domain(
      rowSpacing >= 0 && firstEncroachment >= 0 && secondEncroachment >= 0,
    );
    return { usableWidth: rowSpacing - firstEncroachment - secondEncroachment };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowSpacing: 12, firstEncroachment: 2, secondEncroachment: 3 },
  output: { usableWidth: 7 },
} satisfies ToolExample<Input, Output>;
export const cropAlleyUsableWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/crop-alley-usable-width",
    title: "Crop Alley Usable Width Tool",
    description:
      "Calculate crop alley usable width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowSpacing: { type: "number", minimum: 0 },
        firstEncroachment: { type: "number", minimum: 0 },
        secondEncroachment: { type: "number", minimum: 0 },
      },
      required: ["rowSpacing", "firstEncroachment", "secondEncroachment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { usableWidth: { type: "number" } },
      required: ["usableWidth"],
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
          id: "firstEncroachment",
          label: "First Encroachment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEncroachment",
          label: "Second Encroachment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableWidth",
          label: "Usable Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropAlleyUsableWidthTool.execute;
export default cropAlleyUsableWidthTool;
