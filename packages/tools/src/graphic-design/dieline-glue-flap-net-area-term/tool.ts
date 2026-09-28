import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blankArea: number;
  readonly glueFlapArea: number;
  readonly cutoutArea: number;
  readonly inkExclusionArea: number;
};
export type Output = {
  readonly materialArea: number;
  readonly printableArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankArea: { type: "number", minimum: 0 },
    glueFlapArea: { type: "number", minimum: 0 },
    cutoutArea: { type: "number", minimum: 0 },
    inkExclusionArea: { type: "number", minimum: 0 },
  },
  required: ["blankArea", "glueFlapArea", "cutoutArea", "inkExclusionArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    materialArea: { type: "number" },
    printableArea: { type: "number" },
  },
  required: ["materialArea", "printableArea"],
} as const;
/** Disjoint exclusion areas on a supplied dieline; overlapping exclusions must be union-corrected before use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blankArea, glueFlapArea, cutoutArea, inkExclusionArea } = request;
  const compute = (): Output => {
    H.domain(
      blankArea >= 0 &&
        glueFlapArea >= 0 &&
        cutoutArea >= 0 &&
        inkExclusionArea >= 0 &&
        glueFlapArea + cutoutArea + inkExclusionArea <= blankArea,
    );
    return {
      materialArea: blankArea - cutoutArea,
      printableArea: blankArea - cutoutArea - glueFlapArea - inkExclusionArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    blankArea: 1000,
    glueFlapArea: 100,
    cutoutArea: 150,
    inkExclusionArea: 50,
  },
  output: { materialArea: 850, printableArea: 700 },
} satisfies ToolExample<Input, Output>;
export const dielineGlueFlapNetAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/dieline-glue-flap-net-area-term",
    title: "Dieline Glue Flap Net Area Term Tool",
    description:
      "Disjoint exclusion areas on a supplied dieline; overlapping exclusions must be union-corrected before use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blankArea: { type: "number", minimum: 0 },
        glueFlapArea: { type: "number", minimum: 0 },
        cutoutArea: { type: "number", minimum: 0 },
        inkExclusionArea: { type: "number", minimum: 0 },
      },
      required: ["blankArea", "glueFlapArea", "cutoutArea", "inkExclusionArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        materialArea: { type: "number" },
        printableArea: { type: "number" },
      },
      required: ["materialArea", "printableArea"],
    },
    ports: {
      inputs: [
        {
          id: "blankArea",
          label: "Blank Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "glueFlapArea",
          label: "Glue Flap Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoutArea",
          label: "Cutout Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inkExclusionArea",
          label: "Ink Exclusion Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "materialArea",
          label: "Material Area",
          valueType: { type: "number" },
        },
        {
          id: "printableArea",
          label: "Printable Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dielineGlueFlapNetAreaTermTool.execute;
export default dielineGlueFlapNetAreaTermTool;
