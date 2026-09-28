import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionAreas: readonly number[];
  readonly regionVisible: readonly boolean[];
  readonly scalePresent: readonly boolean[];
  readonly sourceMatched: readonly boolean[];
};
export type Output = {
  readonly visibleArea: number;
  readonly supportedVisibleArea: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    regionVisible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    scalePresent: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceMatched: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["regionAreas", "regionVisible", "scalePresent", "sourceMatched"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleArea: { type: "number" },
    supportedVisibleArea: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["visibleArea", "supportedVisibleArea", "share", "defined"],
} as const;
/** Calculate pelvic image support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionAreas, regionVisible, scalePresent, sourceMatched } = request;
  const compute = (): Output => {
    H.sameLength(regionAreas, regionVisible);
    H.sameLength(regionAreas, scalePresent);
    H.sameLength(regionAreas, sourceMatched);
    H.domain(regionAreas.every((x) => x >= 0));
    return (() => {
      const visibleArea = regionAreas.reduce(
          (s, x, i) => s + (regionVisible[i] ? x : 0),
          0,
        ),
        supportedVisibleArea = regionAreas.reduce(
          (s, x, i) =>
            s +
            (regionVisible[i] && scalePresent[i] && sourceMatched[i] ? x : 0),
          0,
        );
      return {
        visibleArea,
        supportedVisibleArea,
        share: visibleArea > 0 ? supportedVisibleArea / visibleArea : 0,
        defined: visibleArea > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    regionAreas: [2, 3, 5],
    regionVisible: [true, true, false],
    scalePresent: [true, true, true],
    sourceMatched: [true, false, true],
  },
  output: {
    visibleArea: 5,
    supportedVisibleArea: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const pelvicImageSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/pelvic-image-support-share",
    title: "Pelvic Image Support Share Tool",
    description:
      "Calculate pelvic image support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        regionVisible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        scalePresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "regionAreas",
        "regionVisible",
        "scalePresent",
        "sourceMatched",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleArea: { type: "number" },
        supportedVisibleArea: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["visibleArea", "supportedVisibleArea", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "regionAreas",
          label: "Region Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "regionVisible",
          label: "Region Visible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "scalePresent",
          label: "Scale Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceMatched",
          label: "Source Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "visibleArea",
          label: "Visible Area",
          valueType: { type: "number" },
        },
        {
          id: "supportedVisibleArea",
          label: "Supported Visible Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pelvicImageSupportShareTool.execute;
export default pelvicImageSupportShareTool;
