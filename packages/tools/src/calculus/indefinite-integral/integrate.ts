import { simpleError } from "../../core/simple.js";
import {
  evaluateMathExpression,
  finiteMathValue,
  type MathNode,
} from "../../math/expression-evaluator/parser.js";
import {
  differentiateMathExpression,
  mathExpressionNodes,
} from "../../math/expression-evaluator/symbolic.js";

const { number, one, call, negate, add, subtract, multiply, divide, power } =
  mathExpressionNodes;
const unsupported = (): never =>
  simpleError(
    "expression",
    "No supported elementary integration rule matches this expression. Try sums, monomials, constant factors, or supported functions of a linear expression.",
    "unsupported_expression",
  );

// Power, linearity and elementary affine-substitution formulas:
// https://openstax.org/books/calculus-volume-1/pages/a-table-of-integrals
// This bounded rule engine does not guess or numerically fit antiderivatives.
export const integrateMathExpression = (
  tree: MathNode,
  variable: string,
): MathNode => {
  let visited = 0;
  const dependencies = new WeakMap<MathNode, boolean>();
  const dependent = (node: MathNode): boolean => {
    const cached = dependencies.get(node);
    if (cached !== undefined) return cached;
    if (++visited > 8192)
      simpleError("expression", "Integral is too complex.", "resource_limit");
    const result =
      node.kind === "symbol"
        ? node.name === variable
        : node.kind === "unary"
          ? dependent(node.value)
          : node.kind === "binary"
            ? dependent(node.left) || dependent(node.right)
            : node.kind === "call"
              ? node.arguments.some(dependent)
              : false;
    dependencies.set(node, result);
    return result;
  };
  const numeric = (node: MathNode): number | null => {
    if (dependent(node)) return null;
    try {
      return evaluateMathExpression(node);
    } catch {
      return null;
    }
  };
  const x: MathNode = { kind: "symbol", name: variable };
  const powerPrimitive = (base: MathNode, exponent: number): MathNode => {
    if (exponent === -1) return call("ln", call("abs", base));
    const next = finiteMathValue(exponent + 1);
    return divide(power(base, number(next)), number(next));
  };
  const slope = (node: MathNode): MathNode => {
    const derivative = differentiateMathExpression(node, variable);
    const value = numeric(derivative);
    if (value === null || value === 0) return unsupported();
    return number(value);
  };
  type Monomial = { coefficient: MathNode; exponent: number };
  const monomial = (node: MathNode): Monomial | null => {
    if (!dependent(node)) return { coefficient: node, exponent: 0 };
    if (node.kind === "symbol") return { coefficient: one, exponent: 1 };
    if (node.kind === "unary") {
      const value = monomial(node.value);
      return value
        ? { coefficient: negate(value.coefficient), exponent: value.exponent }
        : null;
    }
    if (node.kind !== "binary") return null;
    if (node.operator === "*" || node.operator === "/") {
      const a = monomial(node.left),
        b = monomial(node.right);
      if (!a || !b) return null;
      return node.operator === "*"
        ? {
            coefficient: multiply(a.coefficient, b.coefficient),
            exponent: finiteMathValue(a.exponent + b.exponent),
          }
        : {
            coefficient: divide(a.coefficient, b.coefficient),
            exponent: finiteMathValue(a.exponent - b.exponent),
          };
    }
    if (node.operator === "^") {
      const exponent = numeric(node.right);
      // Direct powers of x support real exponents. Rewriting powers of a
      // product uses integers only, preserving real-domain sign semantics.
      if (
        node.left.kind === "symbol" &&
        node.left.name === variable &&
        exponent !== null
      )
        return { coefficient: one, exponent };
      const a = monomial(node.left);
      if (a && exponent !== null && Number.isSafeInteger(exponent))
        return {
          coefficient: power(a.coefficient, number(exponent)),
          exponent: finiteMathValue(a.exponent * exponent),
        };
    }
    return null;
  };
  const integrate = (node: MathNode): MathNode => {
    if (++visited > 8192)
      simpleError("expression", "Integral is too complex.", "resource_limit");
    if (!dependent(node)) return multiply(node, x);
    if (node.kind === "unary") return negate(integrate(node.value));
    if (node.kind === "binary") {
      if (node.operator === "+")
        return add(integrate(node.left), integrate(node.right));
      if (node.operator === "-")
        return subtract(integrate(node.left), integrate(node.right));
      if (node.operator === "*") {
        if (!dependent(node.left))
          return multiply(node.left, integrate(node.right));
        if (!dependent(node.right))
          return multiply(integrate(node.left), node.right);
      }
      if (node.operator === "/" && !dependent(node.right))
        return divide(integrate(node.left), node.right);
    }
    const term = monomial(node);
    if (term)
      return multiply(term.coefficient, powerPrimitive(x, term.exponent));
    if (node.kind === "binary") {
      if (node.operator === "^" && !dependent(node.right)) {
        const exponent = numeric(node.right);
        if (exponent !== null)
          return divide(powerPrimitive(node.left, exponent), slope(node.left));
      }
      if (node.operator === "^" && !dependent(node.left)) {
        const base = numeric(node.left);
        if (base !== null && base > 0 && base !== 1)
          return divide(
            node,
            multiply(number(Math.log(base)), slope(node.right)),
          );
      }
      if (node.operator === "/" && !dependent(node.left))
        return multiply(
          node.left,
          divide(call("ln", call("abs", node.right)), slope(node.right)),
        );
      return unsupported();
    }
    if (node.kind !== "call") return unsupported();
    if (node.name === "pow")
      return integrate({
        kind: "binary",
        operator: "^",
        left: node.arguments[0],
        right: node.arguments[1],
      });
    const a = node.arguments[0];
    const scale = slope(a);
    let primitive: MathNode;
    switch (node.name) {
      case "sin":
        primitive = negate(call("cos", a));
        break;
      case "cos":
        primitive = call("sin", a);
        break;
      case "tan":
        primitive = negate(call("ln", call("abs", call("cos", a))));
        break;
      case "sinh":
        primitive = call("cosh", a);
        break;
      case "cosh":
        primitive = call("sinh", a);
        break;
      case "tanh":
        primitive = call("ln", call("cosh", a));
        break;
      case "exp":
        primitive = node;
        break;
      case "sqrt":
        primitive = powerPrimitive(a, 0.5);
        break;
      case "cbrt":
        primitive = multiply(number(0.75), power(node, number(4)));
        break;
      case "ln":
        primitive = subtract(multiply(a, node), a);
        break;
      case "log":
      case "log10":
        primitive = divide(
          subtract(multiply(a, call("ln", a)), a),
          number(Math.LN10),
        );
        break;
      case "log2":
        primitive = divide(
          subtract(multiply(a, call("ln", a)), a),
          number(Math.LN2),
        );
        break;
      case "atan":
        primitive = subtract(
          multiply(a, node),
          divide(call("ln", add(one, power(a, number(2)))), number(2)),
        );
        break;
      case "asin":
        primitive = add(
          multiply(a, node),
          call("sqrt", subtract(one, power(a, number(2)))),
        );
        break;
      case "acos":
        primitive = subtract(
          multiply(a, node),
          call("sqrt", subtract(one, power(a, number(2)))),
        );
        break;
      default:
        return unsupported();
    }
    return divide(primitive, scale);
  };
  return integrate(tree);
};
