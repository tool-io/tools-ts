import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly side: string;
  readonly clockHour: number;
  readonly clockMinute: number;
  readonly view: string;
  readonly referenceView: string;
  readonly mirrored: boolean;
};
export type Output = {
  readonly angleDegrees: number;
  readonly viewMatches: boolean;
  readonly sourceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
    clockHour: { type: "integer", minimum: 1, maximum: 12 },
    clockMinute: { type: "integer", minimum: 0, maximum: 59 },
    view: { type: "string", maxLength: 8192 },
    referenceView: { type: "string", maxLength: 8192 },
    mirrored: { type: "boolean" },
  },
  required: [
    "side",
    "clockHour",
    "clockMinute",
    "view",
    "referenceView",
    "mirrored",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleDegrees: { type: "number" },
    viewMatches: { type: "boolean" },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["angleDegrees", "viewMatches", "sourceKey"],
} as const;
/** Translate clockface notation while retaining supplied side/view provenance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { side, clockHour, clockMinute, view, referenceView, mirrored } =
    request;
  const compute = (): Output => {
    H.domain(["left", "right", "unspecified"].includes(side), "side");
    H.integer(clockHour, 1, 12);
    H.integer(clockMinute, 0, 59);
    H.domain(view.length > 0 && referenceView.length > 0, "view");
    const raw = ((clockHour % 12) * 60 + clockMinute) / 2;
    return {
      angleDegrees: mirrored ? (360 - raw) % 360 : raw,
      viewMatches: view === referenceView,
      sourceKey: JSON.stringify([side, view, clockHour, clockMinute]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    side: "left",
    clockHour: 3,
    clockMinute: 0,
    view: "anterior",
    referenceView: "anterior",
    mirrored: false,
  },
  output: {
    angleDegrees: 90,
    viewMatches: true,
    sourceKey: '["left","anterior",3,0]',
  },
} satisfies ToolExample<Input, Output>;
export const specimenSideClockfaceSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/specimen-side-clockface-source-pair",
    title: "Specimen Side Clockface Source Pair Tool",
    description:
      "Translate clockface notation while retaining supplied side/view provenance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "unspecified"],
        },
        clockHour: { type: "integer", minimum: 1, maximum: 12 },
        clockMinute: { type: "integer", minimum: 0, maximum: 59 },
        view: { type: "string", maxLength: 8192 },
        referenceView: { type: "string", maxLength: 8192 },
        mirrored: { type: "boolean" },
      },
      required: [
        "side",
        "clockHour",
        "clockMinute",
        "view",
        "referenceView",
        "mirrored",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleDegrees: { type: "number" },
        viewMatches: { type: "boolean" },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["angleDegrees", "viewMatches", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "clockHour",
          label: "Clock Hour",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "clockMinute",
          label: "Clock Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "view",
          label: "View",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceView",
          label: "Reference View",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mirrored",
          label: "Mirrored",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          valueType: { type: "number" },
        },
        {
          id: "viewMatches",
          label: "View Matches",
          valueType: { type: "boolean" },
        },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = specimenSideClockfaceSourcePairTool.execute;
export default specimenSideClockfaceSourcePairTool;
