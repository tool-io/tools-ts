import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly credits: number;
  readonly contactHours: number;
  readonly creditSystem: string;
};
export type Output = {
  readonly label: string;
  readonly hoursPerCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    credits: { type: "number", exclusiveMinimum: 0 },
    contactHours: { type: "number", minimum: 0 },
    creditSystem: { type: "string", maxLength: 8192 },
  },
  required: ["credits", "contactHours", "creditSystem"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    hoursPerCredit: { type: "number" },
  },
  required: ["label", "hoursPerCredit"],
} as const;
/** Label recorded course credit and contact-hour values without assuming a jurisdictional credit conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { credits, contactHours, creditSystem } = request;
  const compute = (): Output => {
    (H.domain(credits > 0, "credits"), credits);
    H.domain(contactHours >= 0 && creditSystem.length > 0, "contactHours");
    return {
      label:
        credits +
        " " +
        creditSystem +
        " credits; " +
        contactHours +
        " contact hours",
      hoursPerCredit: contactHours / credits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { credits: 3, contactHours: 45, creditSystem: "institutional" },
  output: {
    label: "3 institutional credits; 45 contact hours",
    hoursPerCredit: 15,
  },
} satisfies ToolExample<Input, Output>;
export const courseCreditContactHourLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/course-credit-contact-hour-label",
    title: "Course Credit Contact Hour Label Tool",
    description:
      "Label recorded course credit and contact-hour values without assuming a jurisdictional credit conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        credits: { type: "number", exclusiveMinimum: 0 },
        contactHours: { type: "number", minimum: 0 },
        creditSystem: { type: "string", maxLength: 8192 },
      },
      required: ["credits", "contactHours", "creditSystem"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        hoursPerCredit: { type: "number" },
      },
      required: ["label", "hoursPerCredit"],
    },
    ports: {
      inputs: [
        {
          id: "credits",
          label: "Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactHours",
          label: "Contact Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditSystem",
          label: "Credit System",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "hoursPerCredit",
          label: "Hours Per Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = courseCreditContactHourLabelTool.execute;
export default courseCreditContactHourLabelTool;
