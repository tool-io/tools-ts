import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelAreas: readonly number[];
  readonly groundValid: readonly boolean[];
  readonly observed: readonly boolean[];
};
export type Output = {
  readonly validGroundArea: number;
  readonly observedGroundArea: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    groundValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["pixelAreas", "groundValid", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validGroundArea: { type: "number" },
    observedGroundArea: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["validGroundArea", "observedGroundArea", "share", "defined"],
} as const;
/** Calculate raster pixel ground support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelAreas, groundValid, observed } = request;
  const compute = (): Output => {
    H.sameLength(pixelAreas, groundValid);
    H.sameLength(pixelAreas, observed);
    H.domain(pixelAreas.every((x) => x >= 0));
    return (() => {
      const validGroundArea = pixelAreas.reduce(
          (s, x, i) => s + (groundValid[i] ? x : 0),
          0,
        ),
        observedGroundArea = pixelAreas.reduce(
          (s, x, i) => s + (groundValid[i] && observed[i] ? x : 0),
          0,
        );
      return {
        validGroundArea,
        observedGroundArea,
        share: validGroundArea > 0 ? observedGroundArea / validGroundArea : 0,
        defined: validGroundArea > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelAreas: [2, 3, 5],
    groundValid: [true, true, false],
    observed: [true, false, true],
  },
  output: {
    validGroundArea: 5,
    observedGroundArea: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const rasterPixelGroundSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/raster-pixel-ground-support-share",
    title: "Raster Pixel Ground Support Share Tool",
    description:
      "Calculate raster pixel ground support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        groundValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["pixelAreas", "groundValid", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validGroundArea: { type: "number" },
        observedGroundArea: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["validGroundArea", "observedGroundArea", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "pixelAreas",
          label: "Pixel Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "groundValid",
          label: "Ground Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validGroundArea",
          label: "Valid Ground Area",
          valueType: { type: "number" },
        },
        {
          id: "observedGroundArea",
          label: "Observed Ground Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = rasterPixelGroundSupportShareTool.execute;
export default rasterPixelGroundSupportShareTool;
