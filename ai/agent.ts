import { logEvent } from "./memory/logEvent";
import { generateDoc } from "./actions/generateDoc";
import { verifyPayment } from "./actions/verifyPayment";
import { checkDatabase } from "./actions/checkDatabase";

export async function runAgent(task: string, payload?: any) {
  try {
    await logEvent(\`Agent started task: \${task}\`);

    switch (task) {
      case "generateDoc":
        return await generateDoc(payload);
      case "verifyPayment":
        return await verifyPayment(payload);
      case "checkDatabase":
        return await checkDatabase();
      default:
        throw new Error(\`Unknown task: \${task}\`);
    }
  } catch (err: any) {
    await logEvent(\`Agent task failed: \${task} — \${err.message}\`);
    throw err;
  }
}
