import TransactionList from "../pages/Transaction/TransactionList";
import TransactionForm from "../pages/Transaction/TransactionForm";

/**
 * Define routes and sidebar links at the same time.
 * Note that only items with 'icon' property and
 * without 'redirect' property will be rendered on sidebar.
 */
const transactionsRoutes = [
  {
    path: "/transactions/list",
    name: "trasactionsList",
    component: TransactionList,
    authRequired: true
  },
  {
    path: "/transactions/update/:id",
    name: "TransactionsUpdate",
    component: TransactionForm,
    authRequired: true
  },
  {
    path: "/transactions/create",
    name: "TransactionsCreate",
    component: TransactionForm,
    authRequired: true
  },
  {
    redirect: true,
    path: "/",
    to: "/transactions/list",
  }
];

export default transactionsRoutes;
