import TransactionsLayout from "../layouts/Transactions/TransactionsLayout";
import transactionsRoutes from "./transactions";

const indexRoutes = Array.prototype.concat(
  transactionsRoutes.map(route => ({ layout: TransactionsLayout, ...route }))
);

export default indexRoutes;
