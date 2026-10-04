import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pedestalWidth: number;
  readonly pedestalDepth: number;
  readonly objectWidth: number;
  readonly objectDepth: number;
};
export type Output = {
  readonly sideOffset: number;
  readonly frontOffset: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pedestalWidth: { type: "number", minimum: 0 },
    pedestalDepth: { type: "number", minimum: 0 },
    objectWidth: { type: "number", minimum: 0 },
    objectDepth: { type: "number", minimum: 0 },
  },
  required: ["pedestalWidth", "pedestalDepth", "objectWidth", "objectDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sideOffset: { type: "number" },
    frontOffset: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["sideOffset", "frontOffset", "fits"],
} as const;
/** Calculate exhibition pedestal object centering offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pedestalWidth, pedestalDepth, objectWidth, objectDepth } = request;
  const compute = (): Output => {
    H.domain(
      pedestalWidth >= 0 &&
        pedestalDepth >= 0 &&
        objectWidth >= 0 &&
        objectDepth >= 0,
    );
    return {
      sideOffset: (pedestalWidth - objectWidth) / 2,
      frontOffset: (pedestalDepth - objectDepth) / 2,
      fits: pedestalWidth >= objectWidth && pedestalDepth >= objectDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pedestalWidth: 60,
    pedestalDepth: 50,
    objectWidth: 40,
    objectDepth: 30,
  },
  output: { sideOffset: 10, frontOffset: 10, fits: true },
} satisfies ToolExample<Input, Output>;
export const exhibitionPedestalObjectCenteringOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "visual-arts/exhibition-pedestal-object-centering-offset",
      title: "Exhibition Pedestal Object Centering Offset Tool",
      description:
        "Calculate exhibition pedestal object centering offset from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pedestalWidth: { type: "number", minimum: 0 },
          pedestalDepth: { type: "number", minimum: 0 },
          objectWidth: { type: "number", minimum: 0 },
          objectDepth: { type: "number", minimum: 0 },
        },
        required: [
          "pedestalWidth",
          "pedestalDepth",
          "objectWidth",
          "objectDepth",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sideOffset: { type: "number" },
          frontOffset: { type: "number" },
          fits: { type: "boolean" },
        },
        required: ["sideOffset", "frontOffset", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "pedestalWidth",
            label: "Pedestal Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pedestalDepth",
            label: "Pedestal Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "objectWidth",
            label: "Object Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "objectDepth",
            label: "Object Depth",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sideOffset",
            label: "Side Offset",
            valueType: { type: "number" },
          },
          {
            id: "frontOffset",
            label: "Front Offset",
            valueType: { type: "number" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = exhibitionPedestalObjectCenteringOffsetTool.execute;
export default exhibitionPedestalObjectCenteringOffsetTool;
