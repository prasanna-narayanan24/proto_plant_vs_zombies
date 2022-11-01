class Transaction {
  constructor({ amount, transactionType }) {
    this.amount = amount;
    this.transactionType = transactionType;
  }
}

class Wallet {
  constructor() {
    this.balance = 100;

    /** @type {Transaction[]} */
    this.transactions = [];
  }

  withdraw(amount) {
    const deductedAmount = this.balance - amount;
    if(deductedAmount < 0) {
      return false;
    }

    this.balance = deductedAmount;
    this.transactions.push(new Transaction({ amount, transactionType: 'debit' }));
    return true;
  }

  deposit(amount) {
    this.balance += amount;
    this.transactions.push(new Transaction({ amount, transactionType: 'credit' }))
  }
}