// eslint-disable-next-line strict
const path = require('path');
const app = require(path.resolve(__dirname, '../server/server'));
const ds = app.datasources.db;
// eslint-disable-next-line max-len
const tables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'transaction'];
ds.automigrate(tables, function(err) {
  if (err) throw err;
  const transactions = [
    {
      amount: 40,
      description: 'DEBIT TEST',
      type: 'debit',
      date: new Date(),
    },
    {
      amount: 10,
      description: 'credito do aluguel recebido',
      type: 'credit',
      date: new Date(),
    },
  ];
  var count = transactions.length;

  // for each row create the data
  transactions.forEach(function(transaction) {
    app.models.transaction.create(transaction, function(err, model) {
      if (err) throw err;
      console.log('Createdmodel');
      count--;

      if (count === 0)
        ds.disconnect();
    });
  });
});
