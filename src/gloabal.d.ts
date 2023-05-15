interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
}

interface RouterProps {
  routes: RouteConfig[];
}

declare module "crypto-browserify";

interface ImportMeta {
  readonly env: Record<string, string>;
}

interface IWallet {
  walletId: string;
  accounts: Array<{
    ownerId: string;
    accountId: string;
    parentWalletId: string;
    currency: string;
    createdAt: string;
    linkedCardId: string;
    linkedBankAccountId?: string;
    availableBalance: {
      amount: number;
      currency: string;
    };
  }>;
}
