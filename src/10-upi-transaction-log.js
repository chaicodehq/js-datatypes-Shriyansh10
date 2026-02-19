/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  // Your code here
  if (
    transactions === null ||
    !Array.isArray(transactions) ||
    transactions.length == 0
  )
    return null;
  const updatedTransactions = transactions.filter(
    (transaction) =>
      transaction.amount > 0 &&
      (transaction.type == "credit" || transaction.type == "debit"),
  );
  if (updatedTransactions.length == 0) return null;

  let totalCredit=0;
  let totalDebit=0;
  updatedTransactions.map((txn) => {
    if (txn.type == "credit") totalCredit += txn.amount;
    if (txn.type == "debit") totalDebit += txn.amount;
  });
  const netBalance = totalCredit - totalDebit;
  const transactionCount = updatedTransactions.length;
  const avgTransaction = Math.round(
    (totalCredit + totalDebit) / transactionCount,
  );
  const categoryBreakdown = updatedTransactions.reduce((acc, txn) => {
    if (!acc.hasOwnProperty(txn.category)) acc[txn.category] = txn.amount;
    else acc[txn.category] = acc[txn.category]+txn.amount;
    return acc;
  }, {});
  const highestTransaction = updatedTransactions.toSorted((a,b)=> b.amount-a.amount)
  const allAbove100 = updatedTransactions.every((txn) => txn.amount > 100);
  const hasLargeTransaction = updatedTransactions.some(
    (txn) => txn.amount >= 5000,
  );
  const freqContact = updatedTransactions.reduce((acc, txn) => {
    if (!acc.hasOwnProperty(txn.to)) acc[txn.to] = 1
    else acc[txn.to] += 1;
    return acc;
  }, {});

  const ans = Object.entries(freqContact).sort((a, b) => b[1] - a[1]);

  return { totalCredit, totalDebit, netBalance, transactionCount, avgTransaction, highestTransaction: highestTransaction[0], categoryBreakdown, frequentContact: ans[0][0], allAbove100, hasLargeTransaction}
}
