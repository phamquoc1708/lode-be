export type ConsumerRegisterInput = {
  username: string;
  password: string;
  phone: string;
  displayName: string;
};

export type ConsumerLoginInput = {
  username: string;
  password: string;
};

export type ConsumerBankAccountInput = {
  bank: string;
  numberBank: string;
  ownBank: string;
};

export type ConsumerBetInput = {
  moneyBet: number;
  numberBet: string;
  gameBet: string;
  miniGameBet: string;
  region: string;
  dai: string;
  moneyOneNumber: number;
  winOneNumber: number;
  dateBet: string;
  ratio: string;
};

export type ConsumerMoneyInput = {
  totalMoney: number;
  codeTransfer: string;
  bank: string;
};

export type ConsumerUpdateProfileInput = {
  fullName: string;
};

export type ConsumerCreateDepositInput = {
  bank: string;
  totalMoney: number;
  codeTransfer: string;
};

export type ConsumerCreateWithdrawInput = {
  bank: string;
  totalMoney: number;
  ownBank: string;
  numberBank: string;
};
