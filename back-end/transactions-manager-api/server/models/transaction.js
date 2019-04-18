module.exports = (Transaction) => {
  Transaction.total = async () => {
    const isCredit = type => {
      return type === 'credit' ? true : false;
    };
    const transactions = await Transaction.find();
    const credit = transactions.map(earning =>
    isCredit(earning.type) ? earning.amount : 0)
      .reduce((acc, cur) => acc + parseFloat(cur), 0);
    const debit = transactions.map(earning =>
    !isCredit(earning.type) ? earning.amount : 0)
      .reduce((acc, cur) => acc + parseFloat(cur), 0);

    const total = credit - debit;
    return total.toFixed(2);
  };
};
