import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalMinutes: number;
  readonly openingMinutes: number;
  readonly closingMinutes: number;
  readonly includeClosing: boolean;
};
export type Output = { readonly withinSuppliedWindow: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalMinutes: { type: "number" },
    openingMinutes: { type: "number" },
    closingMinutes: { type: "number" },
    includeClosing: { type: "boolean" },
  },
  required: [
    "arrivalMinutes",
    "openingMinutes",
    "closingMinutes",
    "includeClosing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinSuppliedWindow: { type: "boolean" } },
  required: ["withinSuppliedWindow"],
} as const;
/** Compare an explicit arrival marker with a supplied public-event admission window without deciding admission rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalMinutes, openingMinutes, closingMinutes, includeClosing } =
    request;
  const compute = (): Output => {
    H.domain(closingMinutes >= openingMinutes, "closingMinutes");
    return {
      withinSuppliedWindow:
        arrivalMinutes >= openingMinutes &&
        (includeClosing
          ? arrivalMinutes <= closingMinutes
          : arrivalMinutes < closingMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    arrivalMinutes: 600,
    openingMinutes: 540,
    closingMinutes: 660,
    includeClosing: false,
  },
  output: { withinSuppliedWindow: true },
} satisfies ToolExample<Input, Output>;
export const publicReligiousEventAdmissionWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["religious-studies", "religious studies", "humanities"],
        keywords: ["religious studies", "humanities"],
      },
      id: "religious-studies/public-religious-event-admission-window",
      title: "Public Religious Event Admission Window",
      description:
        "Compare an explicit arrival marker with a supplied public-event admission window without deciding admission rights.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          arrivalMinutes: { type: "number" },
          openingMinutes: { type: "number" },
          closingMinutes: { type: "number" },
          includeClosing: { type: "boolean" },
        },
        required: [
          "arrivalMinutes",
          "openingMinutes",
          "closingMinutes",
          "includeClosing",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { withinSuppliedWindow: { type: "boolean" } },
        required: ["withinSuppliedWindow"],
      },
      ports: {
        inputs: [
          {
            id: "arrivalMinutes",
            label: "Arrival Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "openingMinutes",
            label: "Opening Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "closingMinutes",
            label: "Closing Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeClosing",
            label: "Include Closing",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "withinSuppliedWindow",
            label: "Within Supplied Window",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicReligiousEventAdmissionWindowTool.execute;
export default publicReligiousEventAdmissionWindowTool;
