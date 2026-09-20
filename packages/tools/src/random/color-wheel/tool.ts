import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { hslToHex } from "../color-palette/tool.js";
import { paletteHexSchema } from "../palette-construction.js";

export type ColorWheelInput = {
  readonly sectorCount: number;
  readonly saturationPercent: number;
  readonly lightnessPercent: number;
  readonly innerRadiusFraction: number;
  readonly seed?: number;
};
export type ColorWheelOutput = {
  readonly hueOffsetDegrees: number;
  readonly wedges: readonly {
    readonly startAngleDegrees: number;
    readonly endAngleDegrees: number;
    readonly hueDegrees: number;
    readonly color: string;
    readonly path: string;
  }[];
  readonly svg: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectorCount: { type: "integer", minimum: 2, maximum: 64 },
    saturationPercent: { type: "number", minimum: 0, maximum: 100 },
    lightnessPercent: { type: "number", minimum: 0, maximum: 100 },
    innerRadiusFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    seed: generatorSeedSchema,
  },
  required: [
    "sectorCount",
    "saturationPercent",
    "lightnessPercent",
    "innerRadiusFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hueOffsetDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
    wedges: {
      type: "array",
      minItems: 2,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          startAngleDegrees: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 360,
          },
          endAngleDegrees: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 360,
          },
          hueDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
          color: paletteHexSchema,
          path: { type: "string", minLength: 1, maxLength: 1024 },
        },
        required: [
          "startAngleDegrees",
          "endAngleDegrees",
          "hueDegrees",
          "color",
          "path",
        ],
      },
    },
    svg: { type: "string", minLength: 1, maxLength: 65536 },
    randomness: generatorReplaySchema,
  },
  required: ["hueOffsetDegrees", "wedges", "svg", "randomness"],
} as const;

const isInput = (input: unknown): input is ColorWheelInput =>
  matchesModelInput(input, inputSchema);
export const calculateColorWheel = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ColorWheelOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      hueOffsetDegrees = random.unit() * 360;
    const point = (angle: number): [number, number] => {
      const theta = ((angle - 90) * Math.PI) / 180;
      return [Math.cos(theta), Math.sin(theta)];
    };
    const wedges = Array.from({ length: input.sectorCount }, (_, i) => {
      const startAngleDegrees = (i * 360) / input.sectorCount,
        endAngleDegrees = ((i + 1) * 360) / input.sectorCount;
      const hueDegrees = (hueOffsetDegrees + startAngleDegrees) % 360,
        a = point(startAngleDegrees),
        b = point(endAngleDegrees),
        inner = input.innerRadiusFraction;
      const outer =
        "M " + a[0] + " " + a[1] + " A 1 1 0 0 1 " + b[0] + " " + b[1];
      const path =
        inner === 0
          ? outer + " L 0 0 Z"
          : outer +
            " L " +
            b[0] * inner +
            " " +
            b[1] * inner +
            " A " +
            inner +
            " " +
            inner +
            " 0 0 0 " +
            a[0] * inner +
            " " +
            a[1] * inner +
            " Z";
      return {
        startAngleDegrees,
        endAngleDegrees,
        hueDegrees,
        color: hslToHex(
          hueDegrees,
          input.saturationPercent,
          input.lightnessPercent,
        ),
        path,
      };
    });
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 2 2" role="img" aria-label="Random HSL color wheel">' +
      wedges
        .map(
          (wedge) =>
            '<path d="' + wedge.path + '" fill="' + wedge.color + '"/>',
        )
        .join("") +
      "</svg>";
    return toolSuccess({
      hueOffsetDegrees,
      wedges,
      svg,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const colorWheelExample = {
  input: {
    sectorCount: 6,
    saturationPercent: 70,
    lightnessPercent: 55,
    innerRadiusFraction: 0.6,
    seed: 42,
  },
  output: {
    hueOffsetDegrees: 216.3973506912589,
    wedges: [
      {
        startAngleDegrees: 0,
        endAngleDegrees: 60,
        hueDegrees: 216.3973506912589,
        color: "#3C7BDD",
        path: "M 6.123233995736766e-17 -1 A 1 1 0 0 1 0.8660254037844387 -0.49999999999999994 L 0.5196152422706632 -0.29999999999999993 A 0.6 0.6 0 0 0 3.6739403974420595e-17 -0.6 Z",
      },
      {
        startAngleDegrees: 60,
        endAngleDegrees: 120,
        hueDegrees: 276.3973506912589,
        color: "#9D3CDD",
        path: "M 0.8660254037844387 -0.49999999999999994 A 1 1 0 0 1 0.8660254037844387 0.49999999999999994 L 0.5196152422706632 0.29999999999999993 A 0.6 0.6 0 0 0 0.5196152422706632 -0.29999999999999993 Z",
      },
      {
        startAngleDegrees: 120,
        endAngleDegrees: 180,
        hueDegrees: 336.3973506912589,
        color: "#DD3C7B",
        path: "M 0.8660254037844387 0.49999999999999994 A 1 1 0 0 1 6.123233995736766e-17 1 L 3.6739403974420595e-17 0.6 A 0.6 0.6 0 0 0 0.5196152422706632 0.29999999999999993 Z",
      },
      {
        startAngleDegrees: 180,
        endAngleDegrees: 240,
        hueDegrees: 36.39735069125891,
        color: "#DD9D3C",
        path: "M 6.123233995736766e-17 1 A 1 1 0 0 1 -0.8660254037844387 0.49999999999999994 L -0.5196152422706632 0.29999999999999993 A 0.6 0.6 0 0 0 3.6739403974420595e-17 0.6 Z",
      },
      {
        startAngleDegrees: 240,
        endAngleDegrees: 300,
        hueDegrees: 96.39735069125891,
        color: "#7BDD3C",
        path: "M -0.8660254037844387 0.49999999999999994 A 1 1 0 0 1 -0.8660254037844386 -0.5000000000000001 L -0.5196152422706631 -0.30000000000000004 A 0.6 0.6 0 0 0 -0.5196152422706632 0.29999999999999993 Z",
      },
      {
        startAngleDegrees: 300,
        endAngleDegrees: 360,
        hueDegrees: 156.3973506912589,
        color: "#3CDD9D",
        path: "M -0.8660254037844386 -0.5000000000000001 A 1 1 0 0 1 -1.8369701987210297e-16 -1 L -1.1021821192326178e-16 -0.6 A 0.6 0.6 0 0 0 -0.5196152422706631 -0.30000000000000004 Z",
      },
    ],
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 2 2" role="img" aria-label="Random HSL color wheel"><path d="M 6.123233995736766e-17 -1 A 1 1 0 0 1 0.8660254037844387 -0.49999999999999994 L 0.5196152422706632 -0.29999999999999993 A 0.6 0.6 0 0 0 3.6739403974420595e-17 -0.6 Z" fill="#3C7BDD"/><path d="M 0.8660254037844387 -0.49999999999999994 A 1 1 0 0 1 0.8660254037844387 0.49999999999999994 L 0.5196152422706632 0.29999999999999993 A 0.6 0.6 0 0 0 0.5196152422706632 -0.29999999999999993 Z" fill="#9D3CDD"/><path d="M 0.8660254037844387 0.49999999999999994 A 1 1 0 0 1 6.123233995736766e-17 1 L 3.6739403974420595e-17 0.6 A 0.6 0.6 0 0 0 0.5196152422706632 0.29999999999999993 Z" fill="#DD3C7B"/><path d="M 6.123233995736766e-17 1 A 1 1 0 0 1 -0.8660254037844387 0.49999999999999994 L -0.5196152422706632 0.29999999999999993 A 0.6 0.6 0 0 0 3.6739403974420595e-17 0.6 Z" fill="#DD9D3C"/><path d="M -0.8660254037844387 0.49999999999999994 A 1 1 0 0 1 -0.8660254037844386 -0.5000000000000001 L -0.5196152422706631 -0.30000000000000004 A 0.6 0.6 0 0 0 -0.5196152422706632 0.29999999999999993 Z" fill="#7BDD3C"/><path d="M -0.8660254037844386 -0.5000000000000001 A 1 1 0 0 1 -1.8369701987210297e-16 -1 L -1.1021821192326178e-16 -0.6 A 0.6 0.6 0 0 0 -0.5196152422706631 -0.30000000000000004 Z" fill="#3CDD9D"/></svg>',
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<ColorWheelInput, ColorWheelOutput>;
export const colorWheelTool = createModelDefinition<
  ColorWheelInput,
  ColorWheelOutput
>({
  id: "random/color-wheel",
  title: "Random Color Wheel Generator",
  description:
    "Generate an HSL wheel with a random hue offset, explicit saturation/lightness, annular sector geometry and portable SVG; unlike a hue palette, the output defines a complete circular layout.",
  inputSchema,
  outputSchema,
  execute: calculateColorWheel,
});
export const runColorWheel = colorWheelTool.execute;
export default colorWheelTool;
