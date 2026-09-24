import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invited: number;
  readonly screened: number;
  readonly eligible: number;
  readonly enrolled: number;
};
export type Output = {
  readonly screenedShare: number;
  readonly eligibleAmongScreened: number;
  readonly enrolledAmongEligible: number;
  readonly enrolledAmongInvited: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invited: { type: "integer", minimum: 1 },
    screened: { type: "integer", minimum: 1 },
    eligible: { type: "integer", minimum: 1 },
    enrolled: { type: "integer", minimum: 0 },
  },
  required: ["invited", "screened", "eligible", "enrolled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    screenedShare: { type: "number" },
    eligibleAmongScreened: { type: "number" },
    enrolledAmongEligible: { type: "number" },
    enrolledAmongInvited: { type: "number" },
  },
  required: [
    "screenedShare",
    "eligibleAmongScreened",
    "enrolledAmongEligible",
    "enrolledAmongInvited",
  ],
} as const;
/** Calculate research recruitment invited eligible base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invited, screened, eligible, enrolled } = request;
  const compute = (): Output => {
    H.integer(invited, 1);
    H.integer(screened, 1, invited);
    H.integer(eligible, 1, screened);
    H.integer(enrolled, 0, eligible);
    return {
      screenedShare: screened / invited,
      eligibleAmongScreened: eligible / screened,
      enrolledAmongEligible: enrolled / eligible,
      enrolledAmongInvited: enrolled / invited,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { invited: 100, screened: 80, eligible: 50, enrolled: 40 },
  output: {
    screenedShare: 0.8,
    eligibleAmongScreened: 0.625,
    enrolledAmongEligible: 0.8,
    enrolledAmongInvited: 0.4,
  },
} satisfies ToolExample<Input, Output>;
export const researchRecruitmentInvitedEligibleBaseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-research/research-recruitment-invited-eligible-base",
      title: "Research Recruitment Invited Eligible Base Tool",
      description:
        "Calculate research recruitment invited eligible base from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          invited: { type: "integer", minimum: 1 },
          screened: { type: "integer", minimum: 1 },
          eligible: { type: "integer", minimum: 1 },
          enrolled: { type: "integer", minimum: 0 },
        },
        required: ["invited", "screened", "eligible", "enrolled"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          screenedShare: { type: "number" },
          eligibleAmongScreened: { type: "number" },
          enrolledAmongEligible: { type: "number" },
          enrolledAmongInvited: { type: "number" },
        },
        required: [
          "screenedShare",
          "eligibleAmongScreened",
          "enrolledAmongEligible",
          "enrolledAmongInvited",
        ],
      },
      ports: {
        inputs: [
          {
            id: "invited",
            label: "Invited",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "screened",
            label: "Screened",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "eligible",
            label: "Eligible",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "enrolled",
            label: "Enrolled",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "screenedShare",
            label: "Screened Share",
            valueType: { type: "number" },
          },
          {
            id: "eligibleAmongScreened",
            label: "Eligible Among Screened",
            valueType: { type: "number" },
          },
          {
            id: "enrolledAmongEligible",
            label: "Enrolled Among Eligible",
            valueType: { type: "number" },
          },
          {
            id: "enrolledAmongInvited",
            label: "Enrolled Among Invited",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = researchRecruitmentInvitedEligibleBaseTool.execute;
export default researchRecruitmentInvitedEligibleBaseTool;
