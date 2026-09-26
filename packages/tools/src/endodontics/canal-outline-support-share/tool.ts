import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentLengths: readonly number[];
  readonly outlinePresent: readonly boolean[];
  readonly scaleVerified: readonly boolean[];
};
export type Output = {
  readonly outlineLength: number;
  readonly supportedLength: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentLengths: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    outlinePresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    scaleVerified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["segmentLengths", "outlinePresent", "scaleVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outlineLength: { type: "number" },
    supportedLength: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["outlineLength", "supportedLength", "share", "defined"],
} as const;
/** Calculate canal outline support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentLengths, outlinePresent, scaleVerified } = request;
  const compute = (): Output => {
    H.sameLength(segmentLengths, outlinePresent);
    H.sameLength(segmentLengths, scaleVerified);
    H.domain(segmentLengths.every((x) => x >= 0));
    return (() => {
      const outlineLength = segmentLengths.reduce(
          (s, x, i) => s + (outlinePresent[i] ? x : 0),
          0,
        ),
        supportedLength = segmentLengths.reduce(
          (s, x, i) => s + (outlinePresent[i] && scaleVerified[i] ? x : 0),
          0,
        );
      return {
        outlineLength,
        supportedLength,
        share: outlineLength > 0 ? supportedLength / outlineLength : 0,
        defined: outlineLength > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    segmentLengths: [2, 3, 5],
    outlinePresent: [true, true, false],
    scaleVerified: [true, false, true],
  },
  output: { outlineLength: 5, supportedLength: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const canalOutlineSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/canal-outline-support-share",
    title: "Canal Outline Support Share Tool",
    description:
      "Calculate canal outline support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        outlinePresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        scaleVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["segmentLengths", "outlinePresent", "scaleVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outlineLength: { type: "number" },
        supportedLength: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["outlineLength", "supportedLength", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "segmentLengths",
          label: "Segment Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "outlinePresent",
          label: "Outline Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "scaleVerified",
          label: "Scale Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "outlineLength",
          label: "Outline Length",
          valueType: { type: "number" },
        },
        {
          id: "supportedLength",
          label: "Supported Length",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = canalOutlineSupportShareTool.execute;
export default canalOutlineSupportShareTool;
