import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type ThreeWayMatchInput = {
  readonly tolerancePercent: number;
  readonly values: {
    readonly goodsReceived: {
      readonly quantity: number;
    };
    readonly invoice: {
      readonly amount: number;
      readonly quantity: number;
    };
    readonly purchaseOrder: {
      readonly quantity: number;
      readonly unitPrice: number;
    };
  };
};

export type ThreeWayMatchReason =
  | "goods_received_quantity_differs_from_purchase_order"
  | "invoice_amount_outside_tolerance"
  | "invoice_quantity_differs_from_purchase_order";

export type ThreeWayMatchOutput = {
  readonly invoiceVsPoAmountDelta: number;
  readonly invoiceVsPoQuantityDelta: number;
  readonly matched: boolean;
  readonly reasons: ReadonlyArray<ThreeWayMatchReason>;
  readonly receivedVsPoQuantityDelta: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireRecord = (
  value: unknown,
  field: string,
): Record<string, unknown> => {
  if (isRecord(value)) return value;
  return simpleError(
    field,
    `${field || "Input"} must be an object.`,
    "object_required",
  );
};

const rejectUnknownFields = (
  value: Record<string, unknown>,
  allowed: readonly string[],
  path: string,
): void => {
  const unknown = Object.keys(value).find((field) => !allowed.includes(field));
  if (unknown !== undefined)
    simpleError(
      path === "" ? unknown : `${path}.${unknown}`,
      `${unknown} is not a supported field.`,
      "unknown_field",
    );
};

const requireFiniteNumber = (value: unknown, field: string): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return simpleError(
    field,
    `${field} must be a finite number.`,
    "finite_number_required",
  );
};

const parseThreeWayMatchInput = (input: unknown): ThreeWayMatchInput => {
  const root = requireRecord(input, "");
  rejectUnknownFields(root, ["tolerancePercent", "values"], "");
  const tolerancePercent = requireFiniteNumber(
    root.tolerancePercent,
    "tolerancePercent",
  );
  if (tolerancePercent < 0)
    simpleError(
      "tolerancePercent",
      "Tolerance percent must be zero or greater.",
      "invalid_tolerance",
    );

  const values = requireRecord(root.values, "values");
  rejectUnknownFields(
    values,
    ["goodsReceived", "invoice", "purchaseOrder"],
    "values",
  );
  const goodsReceived = requireRecord(
    values.goodsReceived,
    "values.goodsReceived",
  );
  rejectUnknownFields(goodsReceived, ["quantity"], "values.goodsReceived");
  const invoice = requireRecord(values.invoice, "values.invoice");
  rejectUnknownFields(invoice, ["amount", "quantity"], "values.invoice");
  const purchaseOrder = requireRecord(
    values.purchaseOrder,
    "values.purchaseOrder",
  );
  rejectUnknownFields(
    purchaseOrder,
    ["quantity", "unitPrice"],
    "values.purchaseOrder",
  );

  return {
    tolerancePercent,
    values: {
      goodsReceived: {
        quantity: requireFiniteNumber(
          goodsReceived.quantity,
          "values.goodsReceived.quantity",
        ),
      },
      invoice: {
        amount: requireFiniteNumber(invoice.amount, "values.invoice.amount"),
        quantity: requireFiniteNumber(
          invoice.quantity,
          "values.invoice.quantity",
        ),
      },
      purchaseOrder: {
        quantity: requireFiniteNumber(
          purchaseOrder.quantity,
          "values.purchaseOrder.quantity",
        ),
        unitPrice: requireFiniteNumber(
          purchaseOrder.unitPrice,
          "values.purchaseOrder.unitPrice",
        ),
      },
    },
  };
};

export const performThreeWayMatch = (
  input: ThreeWayMatchInput,
): ThreeWayMatchOutput => {
  if (!Number.isFinite(input.tolerancePercent) || input.tolerancePercent < 0)
    simpleError(
      "tolerancePercent",
      "The tolerance percentage must be a finite value of zero or more.",
      "invalid_tolerance",
    );
  const { goodsReceived, invoice, purchaseOrder } = input.values;
  const values = [
    [goodsReceived.quantity, "values.goodsReceived.quantity"],
    [invoice.amount, "values.invoice.amount"],
    [invoice.quantity, "values.invoice.quantity"],
    [purchaseOrder.quantity, "values.purchaseOrder.quantity"],
    [purchaseOrder.unitPrice, "values.purchaseOrder.unitPrice"],
  ] as const;
  for (const [value, field] of values)
    if (!Number.isFinite(value))
      simpleError(
        field,
        `${field} must be a finite number.`,
        "finite_number_required",
      );
  for (const [value, field] of values)
    if (value < 0)
      simpleError(
        field,
        `${field} must be non-negative for a purchase-order match.`,
        "nonnegative_value_required",
      );

  const poExtended = purchaseOrder.quantity * purchaseOrder.unitPrice;
  if (!Number.isFinite(poExtended))
    simpleError(
      "values.purchaseOrder.unitPrice",
      "The purchase-order extended amount is outside the representable numeric range.",
      "result_not_finite",
    );
  const receivedVsPoQuantityDelta =
    goodsReceived.quantity - purchaseOrder.quantity;
  const invoiceVsPoQuantityDelta = invoice.quantity - purchaseOrder.quantity;
  const invoiceVsPoAmountDelta = invoice.amount - poExtended;
  if (!Number.isFinite(receivedVsPoQuantityDelta))
    simpleError(
      "values.goodsReceived.quantity",
      "The received quantity difference is outside the representable numeric range.",
      "result_not_finite",
    );
  if (!Number.isFinite(invoiceVsPoQuantityDelta))
    simpleError(
      "values.invoice.quantity",
      "The invoice quantity difference is outside the representable numeric range.",
      "result_not_finite",
    );
  if (!Number.isFinite(invoiceVsPoAmountDelta))
    simpleError(
      "values.invoice.amount",
      "The invoice amount difference is outside the representable numeric range.",
      "result_not_finite",
    );

  const reasons: ThreeWayMatchReason[] = [];
  if (receivedVsPoQuantityDelta !== 0)
    reasons.push("goods_received_quantity_differs_from_purchase_order");
  if (invoiceVsPoQuantityDelta !== 0)
    reasons.push("invoice_quantity_differs_from_purchase_order");
  const toleranceAmount = (Math.abs(poExtended) / 100) * input.tolerancePercent;
  const arithmeticTolerance =
    Number.EPSILON *
    4 *
    Math.max(1, Math.abs(invoice.amount), Math.abs(poExtended));
  if (
    Math.abs(invoiceVsPoAmountDelta) >
    Math.max(toleranceAmount, arithmeticTolerance)
  )
    reasons.push("invoice_amount_outside_tolerance");
  return {
    invoiceVsPoAmountDelta:
      invoiceVsPoAmountDelta === 0 ? 0 : invoiceVsPoAmountDelta,
    invoiceVsPoQuantityDelta:
      invoiceVsPoQuantityDelta === 0 ? 0 : invoiceVsPoQuantityDelta,
    matched: reasons.length === 0,
    reasons,
    receivedVsPoQuantityDelta:
      receivedVsPoQuantityDelta === 0 ? 0 : receivedVsPoQuantityDelta,
  };
};

export const threeWayMatchExample = {
  input: {
    tolerancePercent: 0,
    values: {
      goodsReceived: { quantity: 10 },
      invoice: { amount: 125, quantity: 10 },
      purchaseOrder: { quantity: 10, unitPrice: 12.5 },
    },
  },
  output: {
    invoiceVsPoAmountDelta: 0,
    invoiceVsPoQuantityDelta: 0,
    matched: true,
    reasons: [],
    receivedVsPoQuantityDelta: 0,
  },
} satisfies ToolExample<ThreeWayMatchInput, ThreeWayMatchOutput>;

const executeThreeWayMatch = (
  input: unknown,
): ToolResult<ThreeWayMatchOutput> => {
  try {
    return toolSuccess(performThreeWayMatch(parseThreeWayMatchInput(input)));
  } catch (error) {
    if (error instanceof SimpleToolError)
      return invalidInput([
        { code: error.code, field: error.field, message: error.message },
      ]);
    throw error;
  }
};

const finiteNumberSchema = { minimum: 0, type: "number" } as const;

export const threeWayMatchTool = defineTool<
  ThreeWayMatchInput,
  ThreeWayMatchOutput
>({
  contractVersion: 1,
  description:
    "Compare purchase-order, goods-received, and invoice quantity and amount fields and report each mismatch reason without rounding returned differences.",
  execute: executeThreeWayMatch,
  execution: { kind: "pure" },
  id: "auditing/three-way-match-po-grn-invoice-field-by-field-test-procedure",
  inputSchema: {
    additionalProperties: false,
    properties: {
      tolerancePercent: {
        description:
          "Allowed absolute invoice-versus-PO amount difference as a percentage of the absolute PO extended amount.",
        minimum: 0,
        type: "number",
      },
      values: {
        additionalProperties: false,
        description:
          "Purchase-order, goods-received, and invoice values to compare.",
        properties: {
          goodsReceived: {
            additionalProperties: false,
            properties: { quantity: finiteNumberSchema },
            required: ["quantity"],
            type: "object",
          },
          invoice: {
            additionalProperties: false,
            properties: {
              amount: finiteNumberSchema,
              quantity: finiteNumberSchema,
            },
            required: ["amount", "quantity"],
            type: "object",
          },
          purchaseOrder: {
            additionalProperties: false,
            properties: {
              quantity: finiteNumberSchema,
              unitPrice: finiteNumberSchema,
            },
            required: ["quantity", "unitPrice"],
            type: "object",
          },
        },
        required: ["goodsReceived", "invoice", "purchaseOrder"],
        type: "object",
      },
    },
    required: ["tolerancePercent", "values"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      invoiceVsPoAmountDelta: { type: "number" },
      invoiceVsPoQuantityDelta: { type: "number" },
      matched: { type: "boolean" },
      reasons: {
        items: {
          enum: [
            "goods_received_quantity_differs_from_purchase_order",
            "invoice_amount_outside_tolerance",
            "invoice_quantity_differs_from_purchase_order",
          ],
          type: "string",
        },
        type: "array",
      },
      receivedVsPoQuantityDelta: { type: "number" },
    },
    required: [
      "invoiceVsPoAmountDelta",
      "invoiceVsPoQuantityDelta",
      "matched",
      "reasons",
      "receivedVsPoQuantityDelta",
    ],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "tolerancePercent",
        label: "Amount tolerance",
        required: true,
        valueType: { type: "number", unit: "percent" },
      },
      {
        id: "values",
        label: "Document values",
        required: true,
        valueType: { format: "three-way-match-values", type: "object" },
      },
    ],
    outputs: [
      {
        id: "invoiceVsPoAmountDelta",
        label: "Invoice minus PO amount",
        valueType: { format: "currency-amount", type: "number" },
      },
      {
        id: "invoiceVsPoQuantityDelta",
        label: "Invoice minus PO quantity",
        valueType: { type: "number" },
      },
      {
        id: "receivedVsPoQuantityDelta",
        label: "Received minus PO quantity",
        valueType: { type: "number" },
      },
      {
        id: "matched",
        label: "Matched",
        valueType: { type: "boolean" },
      },
      {
        id: "reasons",
        label: "Mismatch reasons",
        valueType: { items: { type: "string" }, type: "list" },
      },
    ],
  },
  title: "Three-Way Match PO GRN Invoice Field-By-Field Test",
});

export const runThreeWayMatch = threeWayMatchTool.execute;
export default threeWayMatchTool;
